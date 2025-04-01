import uuid from "@/utils/uuid";
import * as Types from "../types";
import debugLog from "./debugLog";

let stateCache: Types.State | null = null;
const listeners = new Map<string, (state: Types.State) => void>();

export function getState(): Types.State | null {
  return stateCache;
}

export function setState(state: Types.State): Types.State {
  debugLog("Update State", state.type);

  stateCache = state;

  listeners.forEach((callback) => {
    callback(state);
  });

  return state;
}

export function listenToState(callback: (state: Types.State) => void): {
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
