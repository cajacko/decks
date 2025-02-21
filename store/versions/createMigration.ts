import { PersistPartial } from "redux-persist/lib/persistReducer";
import { PersistState, PersistedState } from "redux-persist/es/types";

const persistReducerKey = "_persist" satisfies keyof PersistPartial;
const versionKey = "version" satisfies keyof PersistState;

/**
 * Helper for migration functions so that we can be extra sure that our typescript is accurate
 */
export default function createMigration<From, To>(props: {
  fromVersion: number;
  toVersion: number;
  migration: (
    state:
      | { validState: From; unknownState?: undefined }
      | { validState?: undefined; unknownState: unknown },
  ) => To | undefined;
}) {
  const migration = (state: PersistedState): PersistedState => {
    if (!state) return undefined;

    const _persist = {
      ...state[persistReducerKey],
      [versionKey]: props.fromVersion,
    };

    const returnState = (newState: To | undefined) =>
      newState ? { ...state, _persist } : undefined;

    try {
      if (state._persist.version !== props.fromVersion) {
        return returnState(props.migration({ unknownState: state }));
      }

      // It's safe to cast now, or as safe as we can reasonably be without type checking everything
      // like a crazy person
      const validState = state as From;

      return returnState(props.migration({ validState }));
    } catch {
      return returnState(props.migration({ unknownState: state }));
    }
  };

  return {
    version: props.toVersion,
    migration,
  };
}
