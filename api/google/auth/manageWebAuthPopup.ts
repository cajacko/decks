import debugLog from "./debugLog";
import * as Playface from "../../playface/auth";
import { Platform } from "react-native";
import processTokens from "./processTokens";
import * as Types from "../types";

export default async function manageWebAuthPopup({
  getUser,
  closeWindowOnTokensInHref = true,
}: {
  closeWindowOnTokensInHref?: boolean;
  getUser: (auth: Types.GoogleAuthTokens) => Promise<Types.GoogleUser>;
}) {
  const tokens = Playface.checkAuthInHref();

  if (!tokens) return;

  debugLog("manageWebAuthPopup - tokens in href");

  await processTokens({
    type: "AUTH_FROM_HREF",
    tokens,
    getUser: () => getUser(tokens),
  });

  if (Platform.OS === "web" && closeWindowOnTokensInHref) {
    debugLog("manageWebAuthPopup - close");

    window.close();
  }
}
