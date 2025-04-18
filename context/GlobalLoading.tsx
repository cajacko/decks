import React from "react";
import { createContext, useContextSelector } from "use-context-selector";

type GlobalLoadingKey = "toolbar" | "settings-cog";

type LoadingRef = Record<GlobalLoadingKey, Record<string, boolean>>;

type GlobalLoadingContext = {
  loading: Record<GlobalLoadingKey, boolean>;
  setLoading: (props: {
    loadingKey: GlobalLoadingKey;
    key: string;
    loading: boolean;
  }) => { unsubscribe: () => void };
};

const initialLoadingState: GlobalLoadingContext["loading"] = {
  toolbar: false,
  "settings-cog": false,
};

const Context = createContext<GlobalLoadingContext>({
  loading: initialLoadingState,
  setLoading: () => ({ unsubscribe: () => {} }),
});

export function useIsGlobalLoading(loadingKey: GlobalLoadingKey): boolean {
  return useContextSelector(
    Context,
    (context) => !!context.loading[loadingKey],
  );
}

export function useControlGlobalLoading(
  loadingKey: GlobalLoadingKey,
  key: string,
  value: boolean,
) {
  const setLoading = useContextSelector(
    Context,
    (context) => context.setLoading,
  );

  React.useEffect(() => {
    setLoading({
      loadingKey,
      key,
      loading: value,
    });

    return () => {
      setLoading({
        loadingKey,
        key,
        loading: false,
      });
    };
  }, [loadingKey, key, setLoading, value]);
}

/**
 * Manages loading via refs and only updates the state when there are changes, to avoid unnecessary
 * re-renders
 */
export const GlobalLoadingProvider = React.memo(function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [loading, setLoading] =
    React.useState<GlobalLoadingContext["loading"]>(initialLoadingState);
  const loadingRef = React.useRef<GlobalLoadingContext["loading"]>(loading);
  loadingRef.current = loading;

  const loadingKeysRef = React.useRef<LoadingRef>({
    "settings-cog": {},
    toolbar: {},
  });

  const setLoadingState = React.useCallback(
    ({
      loadingKey,
      key,
      loading,
    }: {
      loadingKey: GlobalLoadingKey;
      key: string;
      loading: boolean;
    }) => {
      function updateLoadingState(loadingState: boolean) {
        loadingKeysRef.current[loadingKey][key] = loadingState;

        const prevIsLoading: boolean = loadingRef.current[loadingKey];

        const newIsLoading: boolean = Object.values(
          loadingKeysRef.current[loadingKey],
        ).some((value) => value);

        if (prevIsLoading !== newIsLoading) {
          setLoading((prevState) => ({
            ...prevState,
            [loadingKey]: newIsLoading,
          }));
        }
      }

      updateLoadingState(loading);

      return {
        unsubscribe: () => {
          updateLoadingState(false);
        },
      };
    },
    [],
  );

  return (
    <Context.Provider value={{ loading, setLoading: setLoadingState }}>
      {children}
    </Context.Provider>
  );
});
