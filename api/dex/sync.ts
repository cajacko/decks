import { getAppDataFile, setAppDataFile } from "../google/appData";
import { store } from "@/store/store";
import { RootState } from "@/store/types";
import migrate from "@/store/utils/migrate";
import { version } from "@/store/versions/latest";
import { setState } from "@/store/combinedActions/sync";

// NOTE: Warning all changes here must be backwards compatible
type Backup<S = RootState> = {
  state: S;
  date: string;
  reduxPersistVersion: number;
};

const fileName = "sync.json";

export async function getRemote(): Promise<Backup | null> {
  const backup: unknown = await getAppDataFile(fileName);

  if (!backup) return null;
  if (typeof backup !== "object" || !backup) return null;
  if (!("state" in backup) || !("date" in backup)) return null;
  if (typeof backup.date !== "string") return null;
  if (typeof backup.state !== "object" || !backup.state) return null;
  if (!("reduxPersistVersion" in backup)) return null;
  if (typeof backup.reduxPersistVersion !== "number") return null;

  const persistedState: unknown = await migrate(
    backup.state,
    backup.reduxPersistVersion,
  );

  const state = persistedState as RootState;

  store.dispatch(
    setState({
      state,
      dateSaved: backup.date,
    }),
  );

  return {
    state,
    date: backup.date,
    reduxPersistVersion: version,
  };
}

export async function setRemote() {
  const state = store.getState();

  const data: Backup = {
    state,
    date: new Date().toISOString(),
    reduxPersistVersion: version,
  };

  return await setAppDataFile(fileName, data);
}
