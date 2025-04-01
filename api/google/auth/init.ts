import * as Types from "../types";
import { getState, setState } from "./state";
import debugLog from "./debugLog";
import * as persist from "./persist";
import AppError from "@/classes/AppError";
import manageWebAuthPopup from "./manageWebAuthPopup";

export default function init(): Types.State {
  const state = getState();

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
