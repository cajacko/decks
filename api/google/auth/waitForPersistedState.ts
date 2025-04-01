import * as Types from "../types";
import debugLog from "./debugLog";
import AppError from "@/classes/AppError";
import { getState as getPersistedState } from "./persist";
import { getState } from "./state";

const defaultWebAuthTimeout = 1000 * 60 * 2; // 2 minutes

export default async function waitForPersistedState(
  options: {
    timeout?: number;
  } = {},
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
        const state = await getPersistedState();

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
