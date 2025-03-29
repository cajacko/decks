import { PayloadAction } from "@reduxjs/toolkit";
import { produceWithPatches, applyPatches, WritableDraft } from "immer";
import { History, HistoryState, RequiredOperations } from "./versions/latest";

export function resetHistory<State extends object = object>(
  history: History<HistoryState<State>>,
): History<HistoryState<State, RequiredOperations>> {
  return {
    future: [],
    past: [],
    present: {
      ...history.present,
      operation: { type: "RESET", payload: null },
    },
  };
}

type ActionCallback<State, A, SliceState> = (
  state: WritableDraft<WritableDraft<State>>,
  action: A,
  originalNonHistoryState: WritableDraft<SliceState>,
) => void;

export function configureHistory<
  SliceState,
  State extends HistoryState,
  SelectorProps extends object = object,
  ActionProps extends SelectorProps = SelectorProps,
>(
  selectHistory: <S extends WritableDraft<SliceState> | SliceState>(
    state: S,
    props: SelectorProps,
  ) => S extends WritableDraft<SliceState>
    ? WritableDraft<History<State>> | undefined | null
    : History<State> | undefined | null,
  options?: {
    maxHistory?: number;
    preAction?: ActionCallback<State, PayloadAction<ActionProps>, SliceState>;
    postAction?: ActionCallback<State, PayloadAction<ActionProps>, SliceState>;
  },
) {
  const maxHistory = options?.maxHistory || 100;

  return {
    withSelectors: <RootState>(
      selectSlice: (state: RootState) => SliceState,
    ) => {
      const selectPastCount = (state: RootState, props: SelectorProps) =>
        selectHistory(selectSlice(state), props)?.past.length || 0;

      const selectFutureCount = (state: RootState, props: SelectorProps) =>
        selectHistory(selectSlice(state), props)?.future.length || 0;

      return {
        selectPastCount,
        selectFutureCount,
        selectHasPast: (state: RootState, props: SelectorProps): boolean =>
          selectPastCount(state, props) > 0,
        selectHasFuture: (state: RootState, props: SelectorProps): boolean =>
          selectFutureCount(state, props) > 0,
      };
    },
    withHistory:
      <A extends PayloadAction<ActionProps & Pick<State, "operation">>>(
        callback: ActionCallback<State, A, SliceState>,
      ) =>
      (state: WritableDraft<SliceState>, action: A): void => {
        const history = selectHistory(state, action.payload);

        if (!history) return;

        const [nextState, patches, inversePatches] = produceWithPatches(
          history.present,
          (draft: WritableDraft<WritableDraft<State>>) => {
            const operation: State["operation"] = action.payload.operation;

            draft.operation = operation as WritableDraft<
              WritableDraft<State>
            >["operation"];

            if (options?.preAction) {
              options.preAction(draft, action, state);
            }

            callback(draft, action, state);

            if (options?.postAction) {
              options.postAction(draft, action, state);
            }
          },
        );

        history.past.push({ inversePatches, patches });

        if (history.past.length > maxHistory) {
          history.past.shift();
        }

        history.present = nextState;
        history.future = [];
      },
    undo: (
      state: WritableDraft<SliceState>,
      action: PayloadAction<SelectorProps>,
    ) => {
      const history = selectHistory(state, action.payload);

      if (!history) return;

      const lastPatch = history.past.pop(); // Get last undo patch

      if (!lastPatch) return;

      const previousState = applyPatches(
        history.present,
        lastPatch.inversePatches,
      );

      history.future.unshift(lastPatch); // Save inverse for redo
      history.present = previousState;
    },
    redo: (
      state: WritableDraft<SliceState>,
      action: PayloadAction<SelectorProps>,
    ) => {
      const history = selectHistory(state, action.payload);

      if (!history) return;

      const nextPatches = history.future.shift(); // Get last redo patch

      if (!nextPatches) return;

      const nextState = applyPatches(history.present, nextPatches.patches);

      history.past.push(nextPatches); // Save inverse for undo
      history.present = nextState;
    },
    getState: (state: SliceState | null | undefined, props: SelectorProps) => {
      if (!state) return null;

      const history = selectHistory(state, props);

      if (!history) return null;

      return history.present;
    },
    getUndoState: (
      state: SliceState | null | undefined,
      props: SelectorProps,
    ): State | null => {
      if (!state) return null;

      const history = selectHistory(state, props);

      if (!history) return null;

      const lastPatch = history?.past[history.past.length - 1]; // Get last undo patch

      if (!lastPatch) return null;

      const previousState = applyPatches(
        history.present,
        lastPatch.inversePatches,
      );

      return previousState as State;
    },
    getRedoState: (
      state: SliceState | null | undefined,
      props: SelectorProps,
    ): State | null => {
      if (!state) return null;

      const history = selectHistory(state, props);

      if (!history) return null;

      const nextPatches = history?.future[0]; // Get last redo patch

      if (!nextPatches) return null;

      const nextState = applyPatches(history.present, nextPatches.patches);

      return nextState as State;
    },
  };
}
