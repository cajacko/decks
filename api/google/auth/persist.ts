import * as Types from "../types";
import { getItems, setItems, deleteItems } from "@/utils/secureStore";
import debugLog from "./debugLog";

const keys = {
  accessToken: "googleAccessToken",
  refreshToken: "googleRefreshToken",
  accessTokenExpiresAt: "googleAccessTokenExpiresAt",
  user: "googleUser",
};

function parseUser(value: string | undefined | null): Types.GoogleUser | null {
  if (!value) return null;

  const parsed = JSON.parse(value);

  if (!parsed) return null;

  // TODO: Need to do some validation here

  return parsed as Types.GoogleUser;
}

export async function getState(): Promise<Omit<Types.State, "type">> {
  debugLog("getStateFromStorage");

  const items = await getItems(
    keys.accessToken,
    keys.refreshToken,
    keys.accessTokenExpiresAt,
    keys.user,
  );

  const accessToken = items[keys.accessToken];
  const refreshToken = items[keys.refreshToken];
  const accessTokenExpiresAt = items[keys.accessTokenExpiresAt];
  const user = parseUser(items[keys.user]);

  if (!accessToken || !refreshToken) {
    return {
      tokens: null,
      user: user,
    };
  }

  const tokens: Types.GoogleAuthTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiresAt: accessTokenExpiresAt
      ? new Date(accessTokenExpiresAt)
      : null,
  };

  return { tokens, user };
}

export async function setState(state: Types.State): Promise<Types.State> {
  if (!state.tokens) {
    debugLog("Delete Tokens", state.type);

    await deleteItems(
      keys.accessToken,
      keys.refreshToken,
      keys.accessTokenExpiresAt,
      keys.user,
    );
  } else {
    debugLog("Set Tokens", state.type);

    await setItems({
      [keys.accessToken]: state.tokens.accessToken,
      [keys.refreshToken]: state.tokens.refreshToken,
      [keys.accessTokenExpiresAt]: state.tokens.accessTokenExpiresAt
        ? state.tokens.accessTokenExpiresAt.toISOString()
        : null,
      [keys.user]: state.user ? JSON.stringify(state.user) : null,
    });
  }

  return state;
}
