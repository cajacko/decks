import * as Types from "./types";
import { getItems, setItems, deleteItems } from "@/utils/secureStore";
import debugLog from "./debugLog";

const keys = {
  googleAccessToken: "googleAccessToken",
  googleRefreshToken: "googleRefreshToken",
  googleAccessTokenExpiresAt: "googleAccessTokenExpiresAt",
};

export async function getState(): Promise<Omit<Types.State, "type">> {
  debugLog("getStateFromStorage");

  const items = await getItems(
    keys.googleAccessToken,
    keys.googleRefreshToken,
    keys.googleAccessTokenExpiresAt,
  );

  const accessToken = items[keys.googleAccessToken];
  const refreshToken = items[keys.googleRefreshToken];
  const accessTokenExpiresAt = items[keys.googleAccessTokenExpiresAt];

  if (!accessToken || !refreshToken) {
    return {
      tokens: null,
      user: null,
    };
  }

  const tokens: Types.GoogleAuthTokens = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpiresAt: accessTokenExpiresAt
      ? new Date(accessTokenExpiresAt)
      : null,
  };

  return { tokens, user: null };
}

export async function setState(state: Types.State): Promise<Types.State> {
  if (!state.tokens) {
    debugLog("Delete Tokens", state.type);

    await deleteItems(
      keys.googleAccessToken,
      keys.googleRefreshToken,
      keys.googleAccessTokenExpiresAt,
    );
  } else {
    debugLog("Set Tokens", state.type);

    await setItems({
      [keys.googleAccessToken]: state.tokens.accessToken,
      [keys.googleRefreshToken]: state.tokens.refreshToken,
      [keys.googleAccessTokenExpiresAt]: state.tokens.accessTokenExpiresAt
        ? state.tokens.accessTokenExpiresAt.toISOString()
        : null,
    });
  }

  return state;
}
