import AppError from "@/classes/AppError";
import refreshAuth from "./refreshAuth";
import logout from "./logout";

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
  auth: Auth;
}

export async function googleFetch<T>({
  url,
  auth,
  ...requestInit
}: FetchProps) {
  let invalidOrExpired = false;

  const tryFetch = async (): Promise<T> => {
    invalidOrExpired = false;

    const response = await fetch(url, {
      ...requestInit,
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        ...requestInit.headers,
      },
    });

    if (response.status === 401) {
      invalidOrExpired = true;

      throw new AppError("Access token is invalid or expired", {
        status: 401,
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new AppError(
        `Request to ${url} failed (${response.status}): ${errorText}`,
        { status: response.status, url },
      );
    }

    return await response.json();
  };

  try {
    return await tryFetch();
  } catch (err: unknown) {
    if (invalidOrExpired && auth.refreshToken) {
      try {
        await refreshAuth({
          refreshToken: auth.refreshToken,
          getUser: userInfo,
        });

        return await tryFetch();
      } catch (refreshErr) {
        if (invalidOrExpired) {
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
  return async (auth: FetchProps["auth"]): Promise<T> =>
    googleFetch<T>({ ...props, auth });
}
