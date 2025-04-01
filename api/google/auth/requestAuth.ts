import * as Playface from "@/api/playface/auth";
import * as Types from "../types";
import debugLog from "./debugLog";
import * as persist from "./persist";
import updateTokens from "./updateTokens";
import { getState } from "./init";

export default async function requestAuth(
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
    requestAuthState = await persist.waitForPersistedState({
      getState,
    });
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
