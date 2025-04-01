import debugLog from "./debugLog";
import * as Playface from "../../playface/auth";
import { Platform } from "react-native";
import updateTokens from "./updateTokens";

export default async function manageWebAuthPopup(
  options: { closeWindowOnTokensInHref?: boolean } = {},
) {
  const { closeWindowOnTokensInHref = true } = options;
  const tokens = Playface.checkAuthInHref();

  if (!tokens) return;

  debugLog("manageWebAuthPopup - tokens in href");

  await updateTokens({
    type: "AUTH_FROM_HREF",
    tokens,
    user: null,
  });

  if (Platform.OS === "web" && closeWindowOnTokensInHref) {
    debugLog("manageWebAuthPopup - close");

    window.close();
  }
}
