import { getState, refreshAuth, logout } from "./auth";
import AppError from "@/classes/AppError";

export async function authenticatedFetch<T>({
  url,
  ...requestInit
}: {
  url: string;
} & RequestInit) {
  let invalidOrExpired = false;

  const tryFetch = async (): Promise<T> => {
    let accessToken = getState().tokens?.accessToken;
    invalidOrExpired = false;

    const response = await fetch(url, {
      ...requestInit,
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    const refreshToken = getState().tokens?.refreshToken;

    if (invalidOrExpired && refreshToken) {
      try {
        await refreshAuth(refreshToken);

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

export function withAuthenticatedFetch<T>(
  props: {
    url: string;
  } & RequestInit,
) {
  return async (): Promise<T> => authenticatedFetch<T>(props);
}
