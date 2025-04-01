import { Platform } from "react-native";
import * as Playface from "@/api/playface/auth";
import AppError from "@/classes/AppError";
import * as Types from "./types";
import debugLog from "./debugLog";
import * as persist from "./persist";
import { listenToState, setState, withGetState, getMaybeState } from "./state";

export { listenToState };
export const getState = withGetState(init);

const defaultWebAuthTimeout = 1000 * 60 * 2; // 2 minutes

async function updateTokens(state: Types.State): Promise<Types.State> {
  setState(state);

  await persist.setState(state);

  return state;
}

export async function logout(type: "LOGOUT" | "UNAUTHENTICATED" = "LOGOUT") {
  debugLog("Logout");

  await updateTokens({
    user: null,
    tokens: null,
    type,
  });
}

async function waitForAuthFromStorage(
  options: { timeout?: number } = {},
): Promise<
  | { type: "success"; payload: Omit<Types.LoggedInState, "type"> }
  | { type: "timeout" }
> {
  debugLog("waitForAuthFromStorage");

  return new Promise<
    | { type: "success"; payload: Omit<Types.LoggedInState, "type"> }
    | { type: "timeout" }
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

      const state = getState();

      // We've somehow already authenticated, return that
      if (state?.tokens) {
        clearTimeout(timeout);

        resolve({
          type: "success",
          payload: {
            tokens: state.tokens,
            user: state.user,
          },
        });

        return;
      }

      // Don't reject on errors here, just wait out the timeout
      try {
        const state = await persist.getState();

        if (state.tokens) {
          clearTimeout(timeout);

          resolve({
            type: "success",
            payload: {
              tokens: state.tokens,
              user: state.user,
            },
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

export async function requestAuth(
  redirectUri?: string,
): Promise<Types.RequestAuthState> {
  debugLog("requestAuth - init");

  await updateTokens({
    type: "LOGIN_STARTED",
    tokens: null,
    user: null,
  });

  let result = await Playface.requestAuth(redirectUri);
  let requestAuthState: Types.RequestAuthState;

  debugLog("requestAuth - result 1", result.type);

  // Opens on web in a new tab, lets poll the local storage until we have it or timeout
  if (result.type === "opened") {
    requestAuthState = await waitForAuthFromStorage();
  } else {
    requestAuthState =
      result.type === "success"
        ? {
            type: result.type,
            payload: {
              tokens: result.payload,
              user: null,
            },
          }
        : {
            type: result.type,
          };
  }

  debugLog("requestAuth - result 2", result.type);

  if (requestAuthState.type !== "success") return requestAuthState;

  await updateTokens({
    type: "AUTH_FROM_LOGIN",
    tokens: requestAuthState.payload.tokens,
    user: requestAuthState.payload.user,
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
    user: null,
  });

  if (Platform.OS === "web" && closeWindowOnTokensInHref) {
    debugLog("manageWebAuthPopup - close");

    window.close();
  }
}

export function init(): Types.State {
  const state = getMaybeState();

  if (state) return state;

  debugLog("init");

  const newState = setState({
    type: "INITIALIZING",
    tokens: null,
    user: null,
  });

  manageWebAuthPopup()
    .then(persist.getState)
    .then((state) => {
      if (state.tokens) {
        setState({
          type: "AUTH_FROM_STORAGE",
          tokens: state.tokens,
          user: state.user,
        });
      } else {
        setState({
          type: "INITIALIZED",
          tokens: null,
          user: null,
        });
      }

      debugLog("init finished");
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
): Promise<Types.GoogleAuthTokens> {
  debugLog("refreshAuth");

  const tokens = await Playface.refreshAuth(refreshToken);

  setState({
    type: "AUTH_FROM_REFRESH",
    tokens,
    user: null,
  });

  return tokens;
}
