/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { Theme as NavigationTheme } from "@react-navigation/native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

const colors = {
  black: "#000",
  white: "#fff",
  grey: "grey",
};

export const themes = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export type Theme = keyof typeof themes;

export const navigationColors: Record<Theme, NavigationTheme["colors"]> = {
  light: {
    background: "transparent",
    border: "rgb(199, 199, 204)",
    card: "white",
    notification: "rgb(255, 69, 58)",
    primary: "rgb(10, 126, 164)",
    text: "black",
  },
  dark: {
    background: "transparent",
    border: "rgb(199, 199, 204)",
    card: "black",
    notification: "rgb(255, 69, 58)",
    primary: "rgb(10, 126, 164)",
    text: "white",
  },
};

export const cardPresets = {
  black: colors.black,
  white: colors.white,
  grey: colors.grey,
};
