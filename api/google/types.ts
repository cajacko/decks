// NOTE: These values are persisted, if you change them check the persist file to see if you should
// make backward compatible changes
export type GoogleUser = {
  email: string | null;
  id: string;
  name: string | null;
  picture: string | null;
};

// NOTE: These values are persisted, if you change them check the persist file to see if you should
// make backward compatible changes
export type GoogleAuthTokens = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date | null;
};

type CreateStateHelper<Type extends string, IsLoggedIn extends boolean> = {
  type: Type;
  tokens: IsLoggedIn extends true ? GoogleAuthTokens : null;
  user: IsLoggedIn extends true ? GoogleUser | null : null;
};

export type LoggedInState = CreateStateHelper<
  | "AUTH_FROM_STORAGE"
  | "AUTH_FROM_HREF"
  | "AUTH_FROM_LOGIN"
  | "AUTH_FROM_REFRESH",
  true
>;

export type LoggedOutState = CreateStateHelper<
  | "INITIALIZING"
  | "INITIALIZED"
  | "LOGOUT"
  | "UNAUTHENTICATED"
  | "LOGIN_STARTED",
  false
>;

export type State = LoggedInState | LoggedOutState;

export type RequestAuthState =
  | { type: "success"; payload: Omit<LoggedInState, "type"> }
  | { type: "cancel" }
  | { type: "timeout" };
