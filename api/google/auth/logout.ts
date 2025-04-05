import debugLog from "./debugLog";
import updateTokens from "./updateTokens";

export default async function logout(
  type: "LOGOUT" | "UNAUTHENTICATED" = "LOGOUT",
) {
  debugLog("Logout");

  await updateTokens({
    user: null,
    tokens: null,
    type,
  });
}
