import debugLog from "./debugLog";
import internalRefreshAuth from "./internalRefreshAuth";
import { userInfo } from "./fetch";
import { getState } from "./state";
import AppError from "@/classes/AppError";

export default async function refreshAuth(): Promise<void> {
  debugLog("refreshAuth");

  const refreshToken = getState()?.tokens?.refreshToken;

  if (!refreshToken) {
    throw new AppError(
      `${refreshAuth.name} - could not find a refresh token in state`,
    );
  }

  await internalRefreshAuth({
    refreshToken,
    getUser: userInfo,
  });
}
