import AppError from "@/classes/AppError";
import { getState } from "./state";
import { googleFetch, FetchProps as _FetchProps, Auth } from "./fetch";

export type FetchProps = Omit<_FetchProps, "auth">;

export function authenticatedFetch<T>(props: FetchProps): Promise<T> {
  const auth: Auth | null = getState()?.tokens ?? null;

  if (!auth) {
    throw new AppError(`${authenticatedFetch.name} - No auth tokens found`);
  }

  return googleFetch<T>({
    ...props,
    auth,
  });
}

export function withAuthenticatedFetch<T>(props: FetchProps) {
  return async (): Promise<T> => authenticatedFetch<T>(props);
}
