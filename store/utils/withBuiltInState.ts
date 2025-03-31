import { RootState, SliceName } from "../types";
import merge from "lodash/merge";

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
};

export type BuiltInState = Partial<RootState>;

export function getBuiltInState() {
  return builtInState;
}

/**
 * Add stuff to the built in state
 */
export function registerBuiltInState(state: BuiltInState) {
  builtInState = merge(builtInState, state);
}

export default function withBuiltInState<
  R extends unknown,
  S extends RootState = RootState,
>(selector: (state: S) => R): (state: RootState) => R;

export default function withBuiltInState<
  R extends unknown,
  P extends unknown,
  S extends RootState = RootState,
>(selector: (state: S, props: P) => R): (state: RootState, props: P) => R;

export default function withBuiltInState(
  selector: (state: RootState, props?: unknown) => unknown,
) {
  return (state: RootState, props?: unknown) => {
    const storeValue = selector(state, props);

    if (storeValue !== undefined) {
      return storeValue;
    }

    return selector(builtInState, props);
  };
}
