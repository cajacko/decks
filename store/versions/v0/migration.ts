import * as Types from "../v0/types";
import createMigration from "../createMigration";

export type { Types };

export default createMigration<unknown, Types.RootState>({
  fromVersion: -1,
  toVersion: 0,
  // Undefined will reset the state to the default state
  migration: () => undefined,
});
