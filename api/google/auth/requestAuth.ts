import * as Playface from "@/api/playface/auth";
import * as Types from "../types";
import debugLog from "./debugLog";
import waitForPersistedState from "./waitForPersistedState";
import updateTokens from "./updateTokens";
import { userInfo } from "../endpoints/userinfo";
import { setState } from "./state";

export default async function requestAuth(
  redirectUri?: string,
): Promise<Types.RequestAuthState> {
  debugLog("requestAuth - init");

  await updateTokens({
    type: "LOGIN_STARTED",
    tokens: null,
    user: null,
  });

  const result = await Playface.requestAuth(redirectUri);

  debugLog("requestAuth - result 1", result.type);

  if (result.type === "cancel") {
    return {
      type: "cancel",
    };
  }

  // Opens on web in a new tab, lets poll the local storage until we have it or timeout
  if (result.type === "opened") {
    const state = await waitForPersistedState();

    if (state.type === "timeout") {
      debugLog("requestAuth - result 2", state.type);

      return {
        type: "timeout",
      };
    }

    debugLog("requestAuth - result 3", "success");
    return {
      type: "success",
      payload: {
        tokens: state.payload.tokens,
        user: state.payload.user,
      },
    };
  }

  debugLog("requestAuth - result 4");

  // Update the state with the tokens so our userInfo request can work
  setState({
    type: "AUTH_FROM_LOGIN",
    tokens: result.payload,
    user: null,
  });

  const user = await userInfo();

  debugLog("requestAuth - result 5");

  await updateTokens({
    type: "AUTH_FROM_LOGIN",
    tokens: result.payload,
    user,
  });

  debugLog("requestAuth - result 6");

  return {
    type: "success",
    payload: {
      tokens: result.payload,
      user,
    },
  };
}
