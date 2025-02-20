import { PayloadAction } from "@reduxjs/toolkit";
import {
  produceWithPatches,
  applyPatches,
  Patch,
  WritableDraft,
  Draft,
  Objectish,
} from "immer";

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

export interface History<S = unknown> {
  past: Patches[];
  present: S;
  future: Patches[];
}

export function configureHistory<
  SliceState,
  HistoryState extends Objectish,
  P extends {} = {}
>(
  selectHistory: (
    state: WritableDraft<SliceState> | SliceState,
    props: P
  ) => WritableDraft<History<HistoryState>> | undefined | null,
  options?: { maxHistory?: number }
) {
  const maxHistory = options?.maxHistory || 100;

  return {
    withSelectors: <RootState>(
      selectSlice: (state: RootState) => SliceState
    ) => {
      const selectPastCount = (state: RootState, props: P) =>
        selectHistory(selectSlice(state), props)?.past.length || 0;

      const selectFutureCount = (state: RootState, props: P) =>
        selectHistory(selectSlice(state), props)?.future.length || 0;

      return {
        selectPastCount,
        selectFutureCount,
        selectHasPast: (state: RootState, props: P): boolean =>
          selectPastCount(state, props) > 0,
        selectHasFuture: (state: RootState, props: P): boolean =>
          selectFutureCount(state, props) > 0,
      };
    },
    withHistory:
      <A extends PayloadAction<P>>(
        callback: (state: Draft<Draft<HistoryState>>, action: A) => void
      ) =>
      (state: WritableDraft<SliceState>, action: A): void => {
        const history = selectHistory(state, action.payload);

        if (!history) return;

        const [nextState, patches, inversePatches] = produceWithPatches(
          history.present,
          (draft) => callback(draft, action)
        );

        history.past.push({ inversePatches, patches });

        if (history.past.length > maxHistory) {
          history.past.shift();
        }

        history.present = nextState;
        history.future = [];
      },
    undo: (state: WritableDraft<SliceState>, action: PayloadAction<P>) => {
      const history = selectHistory(state, action.payload);

      if (!history) return;

      const lastPatches = history.past.pop(); // Get last undo patch

      if (!lastPatches) return;

      const previousState = applyPatches(
        history.present,
        lastPatches.inversePatches
      );

      history.future.unshift(lastPatches); // Save inverse for redo
      history.present = previousState;
    },
    redo: (state: WritableDraft<SliceState>, action: PayloadAction<P>) => {
      const history = selectHistory(state, action.payload);

      if (!history) return;

      const nextPatches = history.future.shift(); // Get last redo patch

      if (!nextPatches) return;

      const nextState = applyPatches(history.present, nextPatches.patches);

      history.past.push(nextPatches); // Save inverse for undo
      history.present = nextState;
    },
  };
}
