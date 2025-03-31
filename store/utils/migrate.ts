import { PersistedState } from "redux-persist";
import { RootState } from "../types";
import { _migrations } from "../versions/migrations";
import { version as latestVersion } from "../versions/latest";
import AppError from "@/classes/AppError";

/**
 * For manual migration, useful when we're backing up to the cloud in exactly the same way as redux
 * persist
 */
export default async function migrate(
  state: unknown,
  version: number,
): Promise<RootState> {
  if (version > latestVersion) {
    throw new AppError(
      `${migrate.name} - Version ${version} is greater than latest version ${latestVersion}. The client must update to use this version`,
    );
  }

  let nextVersion = version + 1;
  let nextMigration = _migrations[nextVersion];
  let migratedState: unknown = state;

  while (nextMigration) {
    migratedState = await nextMigration(migratedState as PersistedState);
    nextVersion += 1;
    nextMigration = _migrations[nextVersion];
  }

  return migratedState as RootState;
}
