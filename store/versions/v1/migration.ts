import createMigration from "../createMigration";
import { RootState as V0 } from "../v0/types";
import { RootState as V1 } from "../v0/types";
import { resetHistory } from "../../history";

export default createMigration<V0, V1>({
  fromVersion: 0,
  toVersion: 1,
  migration: (props) => {
    if (props.validState) {
      const tabletopsById = { ...props.validState.tabletops.tabletopsById };

      Object.entries(tabletopsById).forEach(([key, tabletop]) => {
        if (!tabletop) return;

        tabletopsById[key] = {
          ...tabletop,
          history: resetHistory(tabletop.history),
        };
      });

      return {
        ...props.validState,
        tabletops: {
          ...props.validState.tabletops,
          tabletopsById: tabletopsById,
        },
      };
    }

    return undefined;
  },
});
