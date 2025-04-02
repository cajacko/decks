import * as Types from "../types";
import { getState, setState } from "./state";
import debugLog from "./debugLog";
import * as persist from "./persist";
import AppError from "@/classes/AppError";
import manageWebAuthPopup from "./manageWebAuthPopup";
import { userInfo } from "../endpoints/userinfo";
import updateTokens from "./updateTokens";

export default function init(): Types.State {
  const state = getState();

  if (state) return state;

  debugLog("init");

  const newState = setState({
    type: "INITIALIZING",
    tokens: null,
    user: null,
  });

  manageWebAuthPopup({
    getUser: userInfo,
  })
    .then(persist.getState)
    .then((state) => {
      const tokens = state.tokens;

      if (tokens) {
        setState({
          type: "AUTH_FROM_STORAGE",
          tokens: tokens,
          user: state.user,
        });

        if (!state.user) return;

        return userInfo(tokens).then((user) =>
          updateTokens({
            type: "AUTH_FROM_STORAGE",
            tokens,
            user,
          }),
        );
      }

      setState({
        type: "INITIALIZED",
        tokens: null,
        user: null,
      });

      debugLog("init finished");
    })
    .catch((unknownError) => {
      AppError.getError(unknownError, "Error getting tokens from storage").log(
        "warn",
      );
    });

  return newState;
}
