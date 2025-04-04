import * as Playface from "@/api/playface/auth";
import * as Types from "../types";
import debugLog from "./debugLog";
import processTokens from "./processTokens";

export default async function internalRefreshAuth({
  refreshToken,
  getUser,
}: {
  refreshToken: string;
  getUser: (auth: Types.GoogleAuthTokens) => Promise<Types.GoogleUser>;
}): Promise<Types.State> {
  debugLog("internalRefreshAuth");
  const tokens = await Playface.refreshAuth(refreshToken);

  const state = await processTokens({
    type: "AUTH_FROM_REFRESH",
    tokens,
    getUser: () => getUser(tokens),
  });

  return state;
}
