import { createMigrate, MigrationManifest } from "redux-persist";
import v0 from "./v0/migration";
import v1 from "./v0/migration";

export const _migrations: MigrationManifest = [v0, v1].reduce(
  (acc, migration) => {
    acc[migration.version] = migration.migration;

    return acc;
  },
  {} as MigrationManifest,
);

export default createMigrate(_migrations, { debug: false });
