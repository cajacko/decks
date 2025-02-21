import { createMigrate, MigrationManifest } from "redux-persist";
import v0 from "./v0/migration";
import v1 from "./v0/migration";

const migrations: MigrationManifest = [v0, v1].reduce((acc, migration) => {
  acc[migration.version] = migration.migration;

  return acc;
}, {} as MigrationManifest);

export default createMigrate(migrations, { debug: false });
