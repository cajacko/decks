import { Patch } from "immer";

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

export interface History<State = unknown> {
  past: Patches[];
  present: State;
  future: Patches[];
}
