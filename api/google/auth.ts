import { getItems, setItems, deleteItems } from "@/utils/secureStore";
import { Platform } from "react-native";
import * as Playface from "@/api/playface/auth";
import AppError from "@/classes/AppError";
import uuid from "@/utils/uuid";
import withDebugLog from "@/utils/withDebugLog";

const debugLog = withDebugLog(
  ({ getFlag }) => getFlag("DEBUG_AUTH"),
  "GoogleAuth",
);

export type GoogleAuthTokens = Playface.Tokens;

const keys = {
  googleAccessToken: "googleAccessToken",
  googleRefreshToken: "googleRefreshToken",
  googleAccessTokenExpiresAt: "googleAccessTokenExpiresAt",
};

const defaultWebAuthTimeout = 1000 * 60 * 2; // 2 minutes

export type State =
  | {
      type:
        | "AUTH_FROM_STORAGE"
        | "AUTH_FROM_HREF"
        | "AUTH_FROM_LOGIN"
        | "AUTH_FROM_REFRESH";
      tokens: GoogleAuthTokens;
    }
  | {
      type:
        | "INITIALIZING"
        | "INITIALIZED"
        | "LOGOUT"
        | "UNAUTHENTICATED"
        | "LOGIN_STARTED";
      tokens: null;
    };

let stateCache: State | null = null;
const listeners = new Map<string, (state: State) => void>();

export function getState(): State {
  if (stateCache) return stateCache;

  return init();
}

function setState(state: State): State {
  debugLog("Update State", state.type);

  stateCache = state;

  listeners.forEach((callback) => {
    callback(state);
  });

  return state;
}

export function listenToState(callback: (state: State) => void): {
  remove: () => void;
} {
  const id = uuid();

  listeners.set(id, callback);

  return {
    remove: () => {
      listeners.delete(id);
    },
  };
}

async function updateTokens(state: State): Promise<State> {
  setState(state);

  if (!state.tokens) {
    debugLog("Delete Tokens", state.type);

    await deleteItems(
      keys.googleAccessToken,
      keys.googleRefreshToken,
      keys.googleAccessTokenExpiresAt,
    );
  } else {
    debugLog("Set Tokens", state.type);

    await setItems({
      [keys.googleAccessToken]: state.tokens.accessToken,
      [keys.googleRefreshToken]: state.tokens.refreshToken,
      [keys.googleAccessTokenExpiresAt]: state.tokens.accessTokenExpiresAt
        ? state.tokens.accessTokenExpiresAt.toISOString()
        : null,
    });
  }

  return state;
}

export async function logout(type: "LOGOUT" | "UNAUTHENTICATED" = "LOGOUT") {
  debugLog("Logout");

  await updateTokens({
    tokens: null,
    type,
  });
}

async function getTokensFromStorage(): Promise<GoogleAuthTokens | null> {
  debugLog("getTokensFromStorage");

  const items = await getItems(
    keys.googleAccessToken,
    keys.googleRefreshToken,
    keys.googleAccessTokenExpiresAt,
  );

  const accessToken = items[keys.googleAccessToken];
  const refreshToken = items[keys.googleRefreshToken];
  const accessTokenExpiresAt = items[keys.googleAccessTokenExpiresAt];

  if (!accessToken || !refreshToken) {
    return null;
  }

  const tokens: GoogleAuthTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiresAt: accessTokenExpiresAt
      ? new Date(accessTokenExpiresAt)
      : null,
  };

  return tokens;
}

async function waitForAuthFromStorage(
  options: { timeout?: number } = {},
): Promise<
  { type: "success"; payload: GoogleAuthTokens } | { type: "timeout" }
> {
  debugLog("waitForAuthFromStorage");

  return new Promise<
    { type: "success"; payload: GoogleAuthTokens } | { type: "timeout" }
  >((resolve, reject) => {
    let pollTimeout: NodeJS.Timeout | null = null;
    let error: AppError | null = null;

    const timeout = setTimeout(() => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }

      if (error) {
        reject(error);
      } else {
        resolve({
          type: "timeout",
        });
      }
    }, options.timeout ?? defaultWebAuthTimeout);

    async function poll() {
      debugLog("waitForAuthFromStorage - poll");

      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }

      // We've somehow already authenticated, return that
      if (stateCache?.tokens) {
        clearTimeout(timeout);

        resolve({
          type: "success",
          payload: stateCache.tokens,
        });

        return;
      }

      // Don't reject on errors here, just wait out the timeout
      try {
        const tokens = await getTokensFromStorage();

        if (tokens) {
          clearTimeout(timeout);

          resolve({
            type: "success",
            payload: tokens,
          });

          return;
        }
      } catch (unknownError) {
        error = AppError.getError(
          unknownError,
          `${waitForAuthFromStorage.name} Error while polling for auth`,
        );
      }

      pollTimeout = setTimeout(poll, 1000);
    }

    poll();
  });
}

type RequestAuthState =
  | { type: "success"; payload: GoogleAuthTokens }
  | { type: "cancel" }
  | { type: "timeout" };

export async function requestAuth(
  redirectUri?: string,
): Promise<RequestAuthState> {
  debugLog("requestAuth - init");

  await updateTokens({
    type: "LOGIN_STARTED",
    tokens: null,
  });

  let result = await Playface.requestAuth(redirectUri);
  let requestAuthState: RequestAuthState;

  debugLog("requestAuth - result 1", result.type);

  // Opens on web in a new tab, lets poll the local storage until we have it or timeout
  if (result.type === "opened") {
    requestAuthState = await waitForAuthFromStorage();
  } else {
    requestAuthState = result;
  }

  debugLog("requestAuth - result 2", result.type);

  if (requestAuthState.type !== "success") return requestAuthState;

  await updateTokens({
    type: "AUTH_FROM_LOGIN",
    tokens: requestAuthState.payload,
  });

  return requestAuthState;
}

async function manageWebAuthPopup(
  options: { closeWindowOnTokensInHref?: boolean } = {},
) {
  const { closeWindowOnTokensInHref = true } = options;
  const tokens = Playface.checkAuthInHref();

  if (!tokens) return;

  debugLog("manageWebAuthPopup - tokens in href");

  await updateTokens({
    type: "AUTH_FROM_HREF",
    tokens,
  });

  if (Platform.OS === "web" && closeWindowOnTokensInHref) {
    debugLog("manageWebAuthPopup - close");

    window.close();
  }
}

export function init(): State {
  if (stateCache) return stateCache;

  debugLog("init");

  const newState = setState({
    type: "INITIALIZING",
    tokens: null,
  });

  manageWebAuthPopup()
    .then(getTokensFromStorage)
    .then((tokens) => {
      if (tokens) {
        setState({
          type: "AUTH_FROM_STORAGE",
          tokens,
        });
      } else {
        setState({
          type: "INITIALIZED",
          tokens: null,
        });
      }

      debugLog("init finished", stateCache?.type);
    })
    .catch((unknownError) => {
      AppError.getError(unknownError, "Error getting tokens from storage").log(
        "warn",
      );
    });

  return newState;
}

export async function refreshAuth(
  refreshToken: string,
): Promise<GoogleAuthTokens> {
  debugLog("refreshAuth");

  const tokens = await Playface.refreshAuth(refreshToken);

  setState({
    type: "AUTH_FROM_REFRESH",
    tokens,
  });

  return tokens;
}

export function withAuthenticatedFetch<T>({
  url,
  method,
}: {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
}) {
  return async (auth: GoogleAuthTokens): Promise<T> => {
    debugLog("authFetch", url);

    let accessToken = auth.accessToken;
    let invalidOrExpired = false;

    const tryFetch = async (token: string): Promise<T> => {
      invalidOrExpired = false;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        invalidOrExpired = true;

        throw new AppError("Access token is invalid or expired", {
          status: 401,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Request to ${url} failed (${response.status}): ${errorText}`,
          { status: response.status, url, method },
        );
      }

      return await response.json();
    };

    try {
      return await tryFetch(accessToken);
    } catch (err: unknown) {
      if (invalidOrExpired && auth.refreshToken) {
        try {
          const refreshed = await refreshAuth(auth.refreshToken);

          return await tryFetch(refreshed.accessToken);
        } catch (refreshErr) {
          if (invalidOrExpired) {
            await logout("UNAUTHENTICATED");
          }

          throw new AppError("Token refresh failed", {
            original: refreshErr,
            url,
            method,
          });
        }
      }

      throw err;
    }
  };
}
