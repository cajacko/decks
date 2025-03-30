import createMigration from "../createMigration";
import { RootState as V1 } from "../v1/types";
import { RootState as V2 } from "../v2/types";

export default createMigration<V1, V2>({
  fromVersion: 0,
  toVersion: 1,
  migration: (props) => {
    if (props.validState) {
      return props.validState;
    }

    return undefined;
  },
});
