import { Patch } from "immer";

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

// TODO: Replace current operations: string and scrollOffset with CreateHistoryOperationHelper
export type RequiredOperations =
  | CreateHistoryOperationHelper<"INIT", null>
  | CreateHistoryOperationHelper<"RESET", null>;

export type CreateHistoryOperationHelper<
  T extends string = string,
  P = unknown,
> = {
  /**
   * The operation that cause the current state change
   */
  type: T;
  /**
   * Any relevant props for this state change. Examples are the scroll position if you need to
   * scroll a user to where the change happened when undo/ redoing etc. Often can be ommitted
   */
  payload: P;
};

export type HistoryState<
  State extends object = object,
  Operation extends CreateHistoryOperationHelper = CreateHistoryOperationHelper,
> = State & {
  operation?: Operation | RequiredOperations | undefined;
};

export interface History<State extends HistoryState = HistoryState> {
  past: Patches[];
  present: State;
  future: Patches[];
}
