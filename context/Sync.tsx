import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import AppError from "@/classes/AppError";
import { useAppSelector } from "@/store/hooks";
import { selectSync } from "@/store/slices/sync";
import {
  sync,
  pull,
  push,
  remove,
  removeDeletedContentAndPush,
} from "@/api/dex/sync";
import useFlag from "@/hooks/useFlag";
import { useAuthentication } from "./Authentication";
import withDebugLog from "@/utils/withDebugLog";
import { useControlGlobalLoading } from "@/context/GlobalLoading";

const debugLog = withDebugLog(() => false, "Sync Context");

type ContextState = {
  featureEnabled: boolean;
  loading: boolean;
  error?: AppError;
  sync: () => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  remove: () => Promise<void>;
  removeDeletedContentAndPush: () => Promise<void>;
};

const autoSyncMinFrequency = 1000 * 60 * 2;
const autoSyncMaxFrequency = 1000 * 30;

const Context = React.createContext<ContextState | undefined>(undefined);

export function useSync() {
  const context = React.useContext(Context);
  const {
    lastPulled,
    lastPushed,
    lastSynced,
    lastRemovedDeletedContent,
    lastSyncSize,
  } = useAppSelector(selectSync);

  if (!context) {
    throw new AppError(
      `${useSync.name} must be used within a ${SyncProvider.name}`,
    );
  }

  return React.useMemo(
    () => ({
      ...context,
      lastSyncSize,
      lastPulled: lastPulled ? new Date(lastPulled) : null,
      lastPushed: lastPushed ? new Date(lastPushed) : null,
      lastSynced: lastSynced ? new Date(lastSynced) : null,
      lastRemovedDeletedContent: lastRemovedDeletedContent
        ? new Date(lastRemovedDeletedContent)
        : null,
    }),
    [
      context,
      lastPulled,
      lastPushed,
      lastSynced,
      lastRemovedDeletedContent,
      lastSyncSize,
    ],
  );
}

export function SyncProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  useControlGlobalLoading("toolbar", "sync", loading);
  const [errorState, setError] = React.useState<AppError | undefined>(
    undefined,
  );
  const { isLoggedIn } = useAuthentication();
  const featureEnabled = useFlag("BACKUP_SYNC") === "enabled" && isLoggedIn;
  const autoSyncEnabled =
    useFlag("AUTO_SYNC") === "enabled" && isLoggedIn && featureEnabled;
  const { lastSynced, lastModifiedImportantChangesLocally } =
    useAppSelector(selectSync);

  const hasImportantChangesToSync = React.useMemo((): boolean => {
    if (!lastModifiedImportantChangesLocally) {
      return false;
    }

    if (!lastSynced) {
      return true;
    }

    const lastModified = new Date(lastModifiedImportantChangesLocally);
    const lastSyncedDate = new Date(lastSynced);

    return lastModified > lastSyncedDate;
  }, [lastSynced, lastModifiedImportantChangesLocally]);

  const error: AppError | undefined = React.useMemo(() => {
    if (!isLoggedIn) {
      return new AppError(`User is not logged in`);
    }

    if (!featureEnabled) {
      return new AppError(`Sync is not enabled`);
    }

    return errorState;
  }, [featureEnabled, errorState, isLoggedIn]);

  const withRequest = React.useCallback(
    (callback: () => Promise<unknown>, debugKey: string) => async () => {
      if (!isLoggedIn) {
        throw new AppError(`User is not logged in`);
      }

      if (!featureEnabled) {
        throw new AppError(`Sync is not enabled`);
      }

      setLoading(true);
      setError(undefined);

      try {
        await callback();
      } catch (unknownError) {
        setError(
          AppError.getError(
            unknownError,
            `${SyncProvider.name} - ${debugKey} encountered an error`,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [featureEnabled, isLoggedIn],
  );

  const requests = React.useMemo(
    () => ({
      pull: withRequest(pull, "pull"),
      push: withRequest(push, "push"),
      sync: withRequest(sync, "sync"),
      remove: withRequest(remove, "remove"),
      removeDeletedContentAndPush: withRequest(
        removeDeletedContentAndPush,
        "removeDeletedContentAndPush",
      ),
    }),
    [withRequest],
  );

  React.useEffect(() => {
    if (!autoSyncEnabled) return;

    debugLog("Auto sync enabled");

    async function syncIfShould() {
      debugLog("Auto sync check");

      if (loading) {
        debugLog("Auto sync check - loading");
        return;
      }

      if (lastSynced) {
        const timeSinceLastSync = Date.now() - new Date(lastSynced).getTime();
        const tooSoon = timeSinceLastSync < autoSyncMaxFrequency;

        if (tooSoon) {
          debugLog("Auto sync check - too soon");

          return;
        }

        if (hasImportantChangesToSync) {
          debugLog("Auto sync check - important changes to sync");
        } else {
          // We're now in polling auto sync mode
          const tooSoon = timeSinceLastSync < autoSyncMinFrequency;

          if (tooSoon) {
            debugLog("Auto sync check - too soon");

            return;
          }
        }
      }

      const state = await AppState.currentState;

      if (state !== "active") {
        debugLog("Auto sync check - not active");
        return;
      }

      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        debugLog("Auto sync check - not connected");
        return;
      }

      if (netInfo.isInternetReachable === false) {
        debugLog("Auto sync check - not reachable");
        return;
      }

      debugLog("Auto sync check - syncing");

      try {
        await requests.sync();

        debugLog("Auto sync check - synced");
      } catch (unknownError) {
        debugLog("Auto sync check - error", unknownError);
        setError(
          AppError.getError(
            unknownError,
            `${SyncProvider.name} - Auto sync failed`,
          ),
        );
      }
    }

    syncIfShould();

    const interval = setInterval(() => {
      syncIfShould();
    }, 1000 * 10);

    return () => {
      clearInterval(interval);
    };
  }, [
    autoSyncEnabled,
    lastSynced,
    loading,
    requests,
    hasImportantChangesToSync,
  ]);

  const value = React.useMemo<ContextState>(
    () => ({
      ...requests,
      featureEnabled,
      error,
      loading,
    }),
    [error, loading, requests, featureEnabled],
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
