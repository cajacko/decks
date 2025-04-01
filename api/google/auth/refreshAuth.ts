import * as Playface from "@/api/playface/auth";
import * as Types from "../types";
import debugLog from "./debugLog";
import { setState } from "./state";

export default async function refreshAuth(
  refreshToken: string,
): Promise<Types.GoogleAuthTokens> {
  debugLog("refreshAuth");

  const tokens = await Playface.refreshAuth(refreshToken);

  setState({
    type: "AUTH_FROM_REFRESH",
    tokens,
    user: null,
  });

  return tokens;
}
