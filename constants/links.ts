import { Platform } from "react-native";
import { ExternalPathString } from "expo-router";

export const playfaceWebsite: ExternalPathString = Platform.select({
  ios: "https://www.playface.fun/s/065ad6ab",
  android: "https://www.playface.fun/s/ff5a0418",
  default: "https://www.playface.fun/s/103404f4",
});

export const dexWebLink: ExternalPathString | null = Platform.select({
  ios: "https://www.playface.fun/s/dexwebios",
  android: "https://www.playface.fun/s/dexwebandroid",
  default: null,
});

export const iosAppStoreLink: ExternalPathString =
  "https://www.playface.fun/s/dex-ios";

export const playStoreLink: ExternalPathString =
  "https://www.playface.fun/s/dex-playstore";

export const privacyPolicyLink: ExternalPathString =
  "https://www.playface.fun/policies";

export const termsLink: ExternalPathString =
  "https://www.playface.fun/policies";

export const charlieJacksonLink: ExternalPathString =
  "https://www.playface.fun/s/e10f07d8";
