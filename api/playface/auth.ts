import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import AppError from "@/classes/AppError";
import * as AuthSession from "expo-auth-session";

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
  return AuthSession.makeRedirectUri();
}

/**
 * type: opened - happens on web, when auth opens in a new tab
 */
export async function requestAuth(
  redirectUri?: string,
): Promise<
  { type: "success"; payload: Tokens } | { type: "cancel" } | { type: "opened" }
> {
  const authUrl = `https://www.playface.fun/api/auth?redirect=${encodeURIComponent(
    redirectUri ?? getRedirectUri(),
  )}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

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

export async function refreshAuth(refreshToken: string): Promise<Tokens> {
  const result = await fetch(`https://www.playface.fun/api/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  });

  const json: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
    scope: string;
    token_type: string;
  } = await result.json();

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
    accessTokenExpiresAt: expiresInToExpiresAt(json.expires_in),
  };
}
