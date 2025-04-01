import * as Types from "../types";
import { getItems, setItems, deleteItems } from "@/utils/secureStore";
import debugLog from "./debugLog";
import AppError from "@/classes/AppError";

const keys = {
  googleAccessToken: "googleAccessToken",
  googleRefreshToken: "googleRefreshToken",
  googleAccessTokenExpiresAt: "googleAccessTokenExpiresAt",
};

export async function getState(): Promise<Omit<Types.State, "type">> {
  debugLog("getStateFromStorage");

  const items = await getItems(
    keys.googleAccessToken,
    keys.googleRefreshToken,
    keys.googleAccessTokenExpiresAt,
  );

  const accessToken = items[keys.googleAccessToken];
  const refreshToken = items[keys.googleRefreshToken];
  const accessTokenExpiresAt = items[keys.googleAccessTokenExpiresAt];

  if (!accessToken || !refreshToken) {
    return {
      tokens: null,
      user: null,
    };
  }

  const tokens: Types.GoogleAuthTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiresAt: accessTokenExpiresAt
      ? new Date(accessTokenExpiresAt)
      : null,
  };

  return { tokens, user: null };
}

export async function setState(state: Types.State): Promise<Types.State> {
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

const defaultWebAuthTimeout = 1000 * 60 * 2; // 2 minutes

export async function waitForPersistedState(options: {
  timeout?: number;
  getState: () => Types.State;
}): Promise<
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

      const state = options.getState();

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
        const state = await getState();

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
          `${waitForPersistedState.name} Error while polling for auth`,
        );
      }

      pollTimeout = setTimeout(poll, 1000);
    }

    poll();
  });
}
