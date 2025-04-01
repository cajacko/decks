import {
  getAppDataFile,
  setAppDataFile,
  removeAppDatafile,
} from "../google/endpoints/appData";
import { store } from "@/store/store";
import { RootState } from "@/store/types";
import migrate from "@/store/utils/migrate";
import { version } from "@/store/versions/latest";
import { setState, syncState } from "@/store/combinedActions/sync";
import { setState as setSyncState } from "@/store/slices/sync";
import { dateToDateString } from "@/utils/dates";

// NOTE: Warning all changes here must be backwards compatible
type Backup<S = RootState> = {
  state: S;
  date: string;
  reduxPersistVersion: number;
};

const fileName = "sync.json";

async function getBackup(): Promise<Backup | null> {
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

  return {
    state,
    date: backup.date,
    reduxPersistVersion: version,
  };
}

export async function pull(): Promise<Backup | null> {
  const backup = await getBackup();
  const now = dateToDateString(new Date());

  if (!backup) {
    store.dispatch(
      setSyncState({
        lastPulled: now,
      }),
    );

    return null;
  }

  store.dispatch(
    setState({
      state: backup.state,
      dateSaved: dateToDateString(new Date(backup.date)),
      date: now,
    }),
  );

  return backup;
}

export async function push() {
  const state = store.getState();

  const data: Backup = {
    state,
    date: dateToDateString(new Date()),
    reduxPersistVersion: version,
  };

  await setAppDataFile(fileName, data);

  store.dispatch(
    setSyncState({
      lastPushed: dateToDateString(new Date()),
    }),
  );
}

export async function remove() {
  await removeAppDatafile(fileName);

  store.dispatch(
    setSyncState({
      lastPulled: null,
      lastPushed: null,
      lastSynced: null,
    }),
  );
}

export async function sync() {
  const backup = await getBackup();

  const now = dateToDateString(new Date());

  store.dispatch(
    setSyncState({
      lastPulled: now,
    }),
  );

  if (!backup) return push();

  store.dispatch(
    syncState({
      state: backup.state,
      dateSaved: dateToDateString(new Date(backup.date)),
      date: now,
    }),
  );

  store.dispatch(
    setSyncState({
      lastPushed: now,
    }),
  );

  return push();
}
