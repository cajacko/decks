import AppError from "@/classes/AppError";
import refreshAuth from "./internalRefreshAuth";
import logout from "./logout";
import { alert } from "@/components/overlays/Alert";
import text from "@/constants/text";
import { getState as _getState } from "./state";
import { GoogleAuthTokens } from "../types";
import debugLog from "./debugLog";

export const userInfo = withGoogleFetch<{
  email: string;
  id: string;
  name: string;
  picture: string;
}>({
  url: "https://www.googleapis.com/oauth2/v3/userinfo",
  method: "GET",
});

export interface Auth {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface FetchProps extends RequestInit {
  url: string;
  auth?: Auth;
}

export async function googleFetch<T>({
  url,
  auth: _auth,
  ...requestInit
}: FetchProps) {
  debugLog(`googleFetch - ${url}`);

  let invalidOrExpired = false;

  let auth = _auth ?? _getState()?.tokens;
  const isLoggedIn = !!auth;

  const tryFetch = async (): Promise<T> => {
    invalidOrExpired = false;

    if (!auth?.accessToken) {
      debugLog(`googleFetch - no access token`);
      invalidOrExpired = true;

      throw new AppError(
        `${googleFetch.name} called but no accessToken is in state`,
      );
    }

    const response = await fetch(url, {
      ...requestInit,
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        ...requestInit.headers,
      },
    });

    if (response.status === 401) {
      debugLog(`googleFetch - 401`);
      invalidOrExpired = true;

      throw new AppError("Access token is invalid or expired", {
        status: 401,
      });
    }

    if (!response.ok) {
      debugLog(`googleFetch - response not ok`);

      const errorText = await response.text();

      throw new AppError(
        `Request to ${url} failed (${response.status}): ${errorText}`,
        { status: response.status, url },
      );
    }

    return await response.json();
  };

  try {
    const result = await tryFetch();

    debugLog(`googleFetch - success`);

    return result;
  } catch (err: unknown) {
    debugLog(`googleFetch - error`, err);
    const refreshToken = auth?.refreshToken;

    if (invalidOrExpired && refreshToken) {
      try {
        debugLog(`googleFetch - attempt refresh`);

        auth = (
          await refreshAuth({
            refreshToken: refreshToken,
            getUser: userInfo,
          })
        ).tokens;

        const result = await tryFetch();

        debugLog(`googleFetch - success after refresh`);

        return result;
      } catch (refreshErr) {
        debugLog(`googleFetch - refresh error`, refreshErr);

        if (invalidOrExpired && isLoggedIn) {
          debugLog(`googleFetch - logout user`);

          alert(({ onRequestClose }) => ({
            title: text["auth.auto_logout.alert.title"],
            message: text["auth.auto_logout.alert.message"],
            buttons: [
              {
                text: text["general.ok"],
                onPress: () => onRequestClose(),
              },
            ],
          }));

          await logout("UNAUTHENTICATED");
        }

        throw new AppError("Token refresh failed", {
          original: refreshErr,
          url,
        });
      }
    }

    throw err;
  }
}

export function withGoogleFetch<T>(props: Omit<FetchProps, "auth">) {
  return async (auth?: GoogleAuthTokens): Promise<T> =>
    googleFetch<T>({ auth, ...props });
}
