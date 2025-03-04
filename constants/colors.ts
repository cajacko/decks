/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { Theme as NavigationTheme } from "@react-navigation/native";
import Color from "color";

const colors = {
  black: "#000",
  white: "#fff",
  grey: "grey",
};

export const themes = {
  light: {
    text: "#11181C",
    link: "#0a7ea4",
    background: colors.white,
    buttonBackground: "#0a7ea4",
    buttonText: colors.white,
  },
  dark: {
    text: "#ECEDEE",
    link: "#0a7ea4",
    background: "#151718",
    buttonBackground: colors.black,
    buttonText: colors.white,
  },
};

export const fixed = {
  shadow: Color(colors.black).alpha(0.5).rgb().string(),
  emptyStackBorder: colors.white,
  cardPresets: {
    black: colors.black,
    white: colors.white,
    grey: colors.grey,
  },
  textureBackground: {
    stop1: "#b0bfdb",
    stop2: "#5d6683",
    stop3: "#3b4258",
  },
  modalBackground: {
    default: Color(colors.black).alpha(0.5).rgb().string(),
    darker: Color(colors.black).alpha(0.75).rgb().string(),
  },
};

export type Theme = keyof typeof themes;

export const navigationColors: Record<Theme, NavigationTheme["colors"]> = {
  light: {
    background: themes.light.background,
    border: "rgb(199, 199, 204)",
    card: themes.light.background,
    notification: "rgb(255, 69, 58)",
    primary: "rgb(10, 126, 164)",
    text: themes.light.text,
  },
  dark: {
    background: themes.dark.background,
    border: "rgb(199, 199, 204)",
    card: themes.dark.background,
    notification: "rgb(255, 69, 58)",
    primary: "rgb(10, 126, 164)",
    text: themes.dark.text,
  },
};
