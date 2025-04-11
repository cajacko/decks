import { RootState, SliceName } from "../types";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";
import includedData from "@/constants/exampleDecks/includedData";
import { createSelector } from "@reduxjs/toolkit";
import { selectIncludedData } from "../slices/includedData";
import { includedDataToRootState } from "@/utils/includedData";

/**
 * Built in state is used to provide a consistent experience in consuming data from selectors, but
 * without having to fill the store with data for examples and then having to manage that being
 * persisted/ cleared/ etc. Redux is for dynamic data that might change, not for static data that
 * will never change. So we do it this way.
 */
let builtInState: RootState = {
  [SliceName.Templates]: {
    templatesById: {},
  },
  [SliceName.Cards]: {
    cardsById: {},
  },
  [SliceName.Decks]: {
    decksById: {},
  },
  [SliceName.Tabletops]: {
    tabletopsById: {},
  },
  [SliceName.UserSettings]: {
    settings: null,
  },
  [SliceName.Sync]: {
    lastSyncSize: null,
    lastPulled: null,
    lastPushed: null,
    lastSynced: null,
    lastRemovedDeletedContent: null,
    lastModifiedImportantChangesLocally: null,
  },
  [SliceName.IncludedData]: {
    data: includedData,
    dateFetched: null,
  },
};

type BuiltInState = Partial<RootState>;

/**
 * Add stuff to the built in state
 */
export function registerBuiltInState(state: BuiltInState) {
  builtInState = merge(builtInState, state);
}

const selectIncludedDataRootState = createSelector(
  (state: RootState) => selectIncludedData(state).data,
  (data): Partial<RootState> => {
    try {
      return includedDataToRootState(data);
    } catch {
      return includedDataToRootState(includedData);
    }
  },
);

export const selectBuiltInState = createSelector(
  () => builtInState,
  selectIncludedDataRootState,
  (builtInState, includedData): RootState => {
    return cloneDeep(merge(builtInState, includedData));
  },
);

export type BuiltInStateSelectorProps<P extends object = object> = P & {
  behaviour?:
    | "built-in-only"
    | "state-only"
    | "prefer-state"
    | "prefer-built-in";
};

export default function withBuiltInStateSelector<
  R extends unknown,
  S extends RootState = RootState,
>(selector: (state: S) => R): (state: RootState) => R;

export default function withBuiltInStateSelector<
  R extends unknown,
  P extends object,
  S extends RootState = RootState,
>(
  selector: (state: S, props: BuiltInStateSelectorProps<P>) => R,
): (state: RootState, props: BuiltInStateSelectorProps<P>) => R;

export default function withBuiltInStateSelector(
  selector: (state: RootState, props?: BuiltInStateSelectorProps) => unknown,
) {
  return createSelector(
    (state: RootState, props?: BuiltInStateSelectorProps) =>
      props?.behaviour === "built-in-only" ? undefined : selector(state, props),
    (state: RootState, props?: BuiltInStateSelectorProps) =>
      props?.behaviour === "state-only"
        ? undefined
        : selector(selectBuiltInState(state), props),
    (state: RootState, props?: BuiltInStateSelectorProps) => props?.behaviour,
    (stateValue, builtInStateValue, behaviour = "prefer-state") => {
      if (behaviour === "prefer-built-in") {
        return builtInStateValue === undefined ? stateValue : builtInStateValue;
      }

      return stateValue === undefined ? builtInStateValue : stateValue;
    },
  );
}
