import { RootState as V0 } from "../v0/types";
import createMigration from "../createMigration";

export default createMigration<unknown, V0>({
  fromVersion: -1,
  toVersion: 0,
  // Undefined will reset the state to the default state
  migration: () => undefined,
});
