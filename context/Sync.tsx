import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import AppError from "@/classes/AppError";
import { useAppSelector } from "@/store/hooks";
import { selectSync } from "@/store/slices/sync";
import { sync, pull, push, remove } from "@/api/dex/sync";
import useFlag from "@/hooks/useFlag";
import { useAuthentication } from "./Authentication";

type ContextState = {
  featureEnabled: boolean;
  loading: boolean;
  error?: AppError;
  sync: () => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  remove: () => Promise<void>;
};

const Context = React.createContext<ContextState | undefined>(undefined);

export function useSync() {
  const context = React.useContext(Context);
  const { lastPulled, lastPushed, lastSynced } = useAppSelector(selectSync);

  if (!context) {
    throw new AppError(
      `${useSync.name} must be used within a ${SyncProvider.name}`,
    );
  }

  return React.useMemo(
    () => ({
      ...context,
      lastPulled: lastPulled ? new Date(lastPulled) : null,
      lastPushed: lastPushed ? new Date(lastPushed) : null,
      lastSynced: lastSynced ? new Date(lastSynced) : null,
    }),
    [context, lastPulled, lastPushed, lastSynced],
  );
}

export function SyncProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  const [errorState, setError] = React.useState<AppError | undefined>(
    undefined,
  );
  const { isLoggedIn } = useAuthentication();
  const featureEnabled = useFlag("BACKUP_SYNC") === "enabled" && isLoggedIn;
  const autoSyncEnabled =
    useFlag("AUTO_SYNC") === "enabled" && isLoggedIn && featureEnabled;
  const { lastSynced } = useAppSelector(selectSync);

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
    }),
    [withRequest],
  );

  // FIXME:
  // React.useEffect(() => {
  //   if (!autoSyncEnabled) return;

  //   let timeout: NodeJS.Timeout;

  //   const maybeAutoSync = async () => {
  //     const { isConnected } = await NetInfo.fetch();
  //     const now = Date.now();
  //     const last = lastSynced ? new Date(lastSynced).getTime() : 0;
  //     const timeSinceLast = now - last;

  //     const minInterval = 1000 * 60 * 5; // 5 minutes

  //     if (
  //       loading ||
  //       !isConnected ||
  //       AppState.currentState !== "active" ||
  //       timeSinceLast < minInterval
  //     ) {
  //       // Retry again in 30 seconds
  //       timeout = setTimeout(maybeAutoSync, 1000 * 30);
  //       return;
  //     }

  //     try {
  //       await requests.sync();
  //     } finally {
  //       timeout = setTimeout(maybeAutoSync, minInterval);
  //     }
  //   };

  //   // Initial check
  //   maybeAutoSync();

  //   // AppState listener to re-trigger sync when app comes into focus
  //   const sub = AppState.addEventListener("change", (nextAppState) => {
  //     if (nextAppState === "active" && !loading) {
  //       maybeAutoSync();
  //     }
  //   });

  //   return () => {
  //     clearTimeout(timeout);

  //     sub.remove();
  //   };
  // }, [autoSyncEnabled, lastSynced, loading, requests]);

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
