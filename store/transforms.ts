import { createTransform } from "redux-persist";
import { RootState, SliceName } from "./types";
import { resetHistory } from "./history";

// Will not persist history but will keep whatever the present state is. Useful as we can't be as
// sure that immer patches will persist nicely as we make changes
export const HistoryTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, key, state: RootState) => {
    if (key !== SliceName.Tabletops) return inboundState;

    const slice = state[key];

    const tabletopsById = { ...slice.tabletopsById };

    Object.entries(tabletopsById).forEach(([key, tabletop]) => {
      if (!tabletop) return;

      tabletopsById[key] = {
        ...tabletop,
        history: resetHistory(tabletop.history),
      };
    });

    return {
      ...slice,
      tabletopsById: tabletopsById,
    };
  },
  undefined,
  // define which reducers this transform gets called for.
  { whitelist: [SliceName.Tabletops] },
);
