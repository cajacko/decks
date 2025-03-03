import exampleDecksToStore from "@/utils/exampleDecksToStore";
import { builtInTemplatesById } from "@/constants/builtInTemplates";
import { RootState, SliceName } from "../types";

let cache: RootState | null = null;

export function builtInState(): RootState {
  if (cache) {
    return cache;
  }

  const state: RootState = {
    ...exampleDecksToStore(),
    [SliceName.Templates]: {
      templatesById: builtInTemplatesById,
    },
    [SliceName.UserSettings]: {},
  };

  cache = state;

  return state;
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

    return selector(
      {
        ...state,
        templates: {
          ...state.templates,
          templatesById: {
            ...state.templates.templatesById,
            ...builtInTemplatesById,
          },
        },
      },
      props,
    );

    // return selector(builtInState(), props);
  };
}
