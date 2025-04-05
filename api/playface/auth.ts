import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import AppError from "@/classes/AppError";
import * as AuthSession from "expo-auth-session";
import withDebugLog from "@/utils/withDebugLog";

const debugLog = withDebugLog(
  ({ getFlag }) => getFlag("DEBUG_AUTH"),
  "PlayfaceAuth",
);

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date | null;
}

function expiresInToExpiresAt(expiresIn: number | null): Date | null {
  if (!expiresIn) return null;
  if (typeof expiresIn !== "number" || isNaN(expiresIn)) {
    new AppError(`${expiresInToExpiresAt.name} expiresIn is not a number`, {
      expiresIn,
    }).log("warn");

    return null;
  }

  return new Date(Date.now() + expiresIn * 1000);
}

function extractTokens(url: string): Tokens {
  debugLog(`Extracting tokens from url`);

  const params = new URLSearchParams(url.split("#")[1]);
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const expiresIn = params.get("expires_in");

  if (!accessToken || !refreshToken) {
    throw new AppError(
      `${extractTokens.name} Could not extract tokens from URL`,
      { url },
    );
  }

  let expiresInNumber = expiresIn ? parseInt(expiresIn, 10) : null;

  if (typeof expiresInNumber === "number" && isNaN(expiresInNumber)) {
    expiresInNumber = null;
  }

  let accessTokenExpiresAt: Date | null = null;

  if (expiresInNumber) {
    accessTokenExpiresAt = expiresInToExpiresAt(expiresInNumber);
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
  };
}

export function getRedirectUri(): string {
  const redirectUri = AuthSession.makeRedirectUri({});

  debugLog(`getRedirectUri - redirectUri: ${redirectUri}`);

  return redirectUri;
}

/**
 * type: opened - happens on web, when auth opens in a new tab
 */
export async function requestAuth(
  redirectUriProp?: string,
): Promise<
  { type: "success"; payload: Tokens } | { type: "cancel" } | { type: "opened" }
> {
  const redirectUri = redirectUriProp ?? getRedirectUri();

  const authUrl = `https://www.playface.fun/api/auth?redirect=${encodeURIComponent(
    redirectUri,
  )}`;

  debugLog(`requestAuth - authUrl: ${authUrl}`);

  // NOTE: We have to have the redirectUri here match the one we end up in, otherwise it won't pass
  // the finished url with the tokens in the hash on return
  const promise = WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (Platform.OS === "web") {
    debugLog("requestAuth - web");
    return { type: "opened" };
  }

  debugLog("requestAuth - mobile");

  const result = await promise;

  debugLog("requestAuth - result", result.type);

  switch (result.type) {
    case "success": {
      return {
        type: "success",
        payload: extractTokens(result.url),
      };
    }
    case WebBrowser.WebBrowserResultType.CANCEL:
    case WebBrowser.WebBrowserResultType.DISMISS:
      return { type: "cancel" };
    case WebBrowser.WebBrowserResultType.OPENED:
      return { type: "opened" };
    default:
      throw new AppError(
        `${requestAuth.name} Could not authenticate user via playface apis, web browser result "${result.type}"`,
        { result, redirectUri },
      );
  }
}

export function checkAuthInHref(): Tokens | null {
  if (Platform.OS !== "web") return null;

  try {
    return extractTokens(window.location.href);
  } catch {
    return null;
  }
}

interface PlayfaceRefreshResponse {
  access_token: string;
  // id_token: string;
  expires_in: number;
  // refresh_token_expires_in: number;
  // scope: string;
  // token_type: string;
}

function validateRefreshResponse(
  json: unknown,
): json is PlayfaceRefreshResponse {
  if (typeof json !== "object" || json === null) return false;

  if (!("access_token" in json)) return false;
  if (!("expires_in" in json)) return false;
  if (typeof json.access_token !== "string") return false;
  if (typeof json.expires_in !== "number") return false;

  // This ensures we do actually have a valid response
  const response: PlayfaceRefreshResponse = {
    access_token: json.access_token,
    expires_in: json.expires_in,
  };

  return !!response;
}

export async function refreshAuth(refreshToken: string): Promise<Tokens> {
  debugLog("refreshAuth - refreshing auth");

  const result = await fetch(`https://www.playface.fun/api/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

  const json: unknown = await result.json();

  if (validateRefreshResponse(json) === false) {
    throw new AppError(
      `${refreshAuth.name} Invalid response from playface api`,
      { json, status: result.status },
    );
  }

  return {
    accessToken: json.access_token,
    // Doesn't change
    refreshToken,
    accessTokenExpiresAt: expiresInToExpiresAt(json.expires_in),
  };
}
