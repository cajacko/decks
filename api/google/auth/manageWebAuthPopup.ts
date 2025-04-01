import debugLog from "./debugLog";
import * as Playface from "../../playface/auth";
import { Platform } from "react-native";
import updateTokens from "./updateTokens";
import { userInfo } from "../endpoints/userinfo";
import { setState } from "./state";

export default async function manageWebAuthPopup(
  options: { closeWindowOnTokensInHref?: boolean } = {},
) {
  const { closeWindowOnTokensInHref = true } = options;
  const tokens = Playface.checkAuthInHref();

  if (!tokens) return;

  debugLog("manageWebAuthPopup - tokens in href");

  // Needed to the userInfo call has auth
  setState({
    type: "AUTH_FROM_HREF",
    tokens,
    user: null,
  });

  const user = await userInfo();

  updateTokens({
    type: "AUTH_FROM_HREF",
    tokens,
    user,
  });

  if (Platform.OS === "web" && closeWindowOnTokensInHref) {
    debugLog("manageWebAuthPopup - close");

    window.close();
  }
}
