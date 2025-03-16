import { ExpoConfig, ConfigContext } from "expo/config";

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

  // Dex: Play, Discover & Create Card Games with Dex by Playface
  return "Dex: Play, Discover & Create Card Games with Dex by Playface";
};

// On the home screen
// const appDisplayName = "Dex";
// const bundleId = `fun.playface.dex.www`;
// const domain = `www.dex.playface.fun`;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: getAppName(), // Actual app name
  slug: "decks", // Only used in expo for identifying the project
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "dex",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  platforms: ["ios", "android", "web"],
  ios: {
    // buildNumber // TODO: Auto increment
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
    // associatedDomains: [`applinks:${domain}`],
  },
  android: {
    // versionCode // TODO: Auto increment
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: getUniqueIdentifier(),
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-font",
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
      },
    ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        // dark: {
        //   image: "./assets/splash-icon-dark.png",
        //   backgroundColor: "#000000",
        // },
      },
    ],
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
