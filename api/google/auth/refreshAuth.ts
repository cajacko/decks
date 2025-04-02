import * as Playface from "@/api/playface/auth";
import * as Types from "../types";
import debugLog from "./debugLog";
import processTokens from "./processTokens";

export default async function refreshAuth({
  refreshToken,
  getUser,
}: {
  refreshToken: string;
  getUser: (auth: Types.GoogleAuthTokens) => Promise<Types.GoogleUser>;
}): Promise<Types.State> {
  debugLog("refreshAuth");
  const tokens = await Playface.refreshAuth(refreshToken);

  const state = await processTokens({
    type: "AUTH_FROM_REFRESH",
    tokens,
    getUser: () => getUser(tokens),
  });

  return state;
}
