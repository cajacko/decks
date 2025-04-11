import { ExpoConfig, ConfigContext } from "expo/config";
import colors from "./constants/playfaceColors.json";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "fun.playface.dex.www.dev";
  }

  if (IS_PREVIEW) {
    return "fun.playface.dex.www.preview";
  }

  return "fun.playface.dex.www";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Dex (Dev)";
  }

  if (IS_PREVIEW) {
    return "Dex (Preview)";
  }

  // 30 chars for iOS
  // Dex: Play, Discover & Create Card Games
  return "Dex: Play & Create Card Games";
};

// Ensures works on dev client and standalone
const splash: ExpoConfig["splash"] = {
  image: "./assets/images/splash-icon.png",
  imageWidth: 200,
  resizeMode: "contain",
  backgroundColor: colors.black,
};

// On the home screen
// const appDisplayName = "Dex";
// const bundleId = `fun.playface.dex.www`;
// const domain = `www.dex.playface.fun`;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(), // Actual app name
  slug: "decks", // Only used in expo for identifying the project
  version: "1.3.0", // Update when releasing new native changes
  orientation: "portrait",
  icon: "./assets/images/app-icon.png",
  scheme: "dex",
  // Default here, but users can always override in settings
  userInterfaceStyle: "dark",
  backgroundColor: colors.black,
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  ios: {
    // buildNumber // TODO: Auto increment
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    // associatedDomains: [`applinks:${domain}`],
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {},
  },
  android: {
    // versionCode // TODO: Auto increment
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-adaptive-icon-foreground.png",
      backgroundImage: "./assets/images/android-adaptive-icon-background.png",
      monochromeImage: "./assets/images/android-adaptive-icon-monochrome.png",
      backgroundColor: colors.black,
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
    backgroundColor: colors.black,
  },
  splash,
  plugins: [
    "expo-secure-store",
    [
      "expo-sensors",
      {
        motionPermission: "Allow $(PRODUCT_NAME) to access your device motion.",
      },
    ],
    "expo-font",
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
      },
    ],
    "expo-router",
    ["expo-splash-screen", splash],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "e9b5331b-fd5c-4a1c-ae88-d238028836a6",
    },
  },
  owner: "charliejackson",
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    enabled: true,
    checkAutomatically: "ON_LOAD",
    url: "https://u.expo.dev/e9b5331b-fd5c-4a1c-ae88-d238028836a6",
  },
});
