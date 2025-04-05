import React from "react";
import AppError from "@/classes/AppError";
import useFlag from "@/hooks/useFlag";
import {
  init as initGoogleAuth,
  logout as googleLogout,
  requestAuth,
  listenToState,
  GoogleUser,
  refreshAuth,
} from "@/api/google";

type ContextState = {
  featureEnabled: boolean;
  isLoggedIn: boolean;
  user: GoogleUser | null;
  error?: AppError;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  _refreshAuthToken: () => Promise<void>;
};

const Context = React.createContext<ContextState | undefined>(undefined);

export function useAuthentication(): ContextState {
  const context = React.useContext(Context);

  if (!context) {
    throw new AppError(
      `${useAuthentication.name} must be used within a ${AuthenticationProvider.name}`,
    );
  }

  return context;
}

export function AuthenticationProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
  const [_error, setError] = React.useState<AppError | undefined>(undefined);
  const featureEnabled = useFlag("BACKUP_SYNC") === "enabled";
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<GoogleUser | null>(null);

  const error = React.useMemo(() => {
    if (featureEnabled) return _error;

    return new AppError(
      `${AuthenticationProvider.name} - authentication feature is not enabled`,
    );
  }, [_error, featureEnabled]);

  React.useEffect(() => {
    if (!featureEnabled) return;

    initGoogleAuth();

    const { remove } = listenToState((state) => {
      setUser(state.user);
      setIsLoggedIn(!!state.tokens);
    });

    return remove;
  }, [featureEnabled]);

  const login = React.useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      if (!featureEnabled) {
        throw new AppError(
          `${AuthenticationProvider.name} - login attempted when feature is disabled`,
        );
      }

      const result = await requestAuth();

      if (result.type === "success") {
        setUser(result.payload.user);
        setIsLoggedIn(true);
      } else {
        throw new AppError(
          `${AuthenticationProvider.name} - login failed with type: ${result.type}`,
        );
      }
    } catch (unknownError) {
      setError(
        AppError.getError(
          unknownError,
          `${AuthenticationProvider.name} - login encountered an error`,
        ),
      );
    }

    setLoading(false);
  }, [featureEnabled]);

  const _refreshAuthToken = React.useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      if (!featureEnabled) {
        throw new AppError(
          `${AuthenticationProvider.name} - _refreshAuthToken attempted when feature is disabled`,
        );
      }

      await refreshAuth();
    } catch (unknownError) {
      setError(
        AppError.getError(
          unknownError,
          `${AuthenticationProvider.name} - _refreshAuthToken encountered an error`,
        ),
      );
    }

    setLoading(false);
  }, [featureEnabled]);

  const logout = React.useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      googleLogout();
      setIsLoggedIn(false);
      setUser(null);
    } catch (unknownError) {
      setError(
        AppError.getError(
          unknownError,
          `${AuthenticationProvider.name} - logout encountered an error`,
        ),
      );
    }

    setLoading(false);
  }, []);

  const value = React.useMemo<ContextState>(
    () => ({
      featureEnabled,
      error,
      loading,
      isLoggedIn,
      user,
      login,
      logout,
      _refreshAuthToken,
    }),
    [
      error,
      loading,
      featureEnabled,
      login,
      logout,
      user,
      isLoggedIn,
      _refreshAuthToken,
    ],
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
