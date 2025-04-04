/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { Theme as NavigationTheme } from "@react-navigation/native";
import Color from "color";
import playfaceColors from "./playfaceColors.json";

const colors = {
  ...playfaceColors,
};

const dragBarPassiveDark = Color(colors.black).lighten(0.5).hex();
const dragBarPassiveLight = Color(colors.white).darken(0.1).hex();

const lightBackground = Color(colors.white).darken(0.01).hex();

const textureBackground = {
  stop1: "#b0bfdb",
  stop2: "#5d6683",
  stop3: "#3b4258",
};

export const themes = {
  light: {
    primary: colors.blue,
    text: colors.darkBlue,
    link: colors.red,
    background: lightBackground,
    skeleton: Color(lightBackground).darken(0.1).rgb().string(),
    skeletonPulse: Color(lightBackground).darken(0.075).rgb().string(),
    skeletonCard: lightBackground,
    buttonBackground: lightBackground,
    buttonText: colors.darkBlue,
    drawerDragBarPassive: dragBarPassiveLight,
    drawerDragBarActive: Color(lightBackground).darken(0.2).hex(),
    inputOutline: colors.darkBlue,
    placeholder: Color(colors.darkBlue).alpha(0.5).rgb().string(),
    changesIndicator: colors.blue,
    switchTrackTrue: colors.darkBlue,
    switchTrackFalse: dragBarPassiveLight,
    switchThumb: lightBackground,
    textureBackgroundStop1: Color(textureBackground.stop1).lighten(0.2).hex(),
    textureBackgroundStop2: Color(textureBackground.stop2).lighten(0.6).hex(),
    textureBackgroundStop3: Color(textureBackground.stop3).lighten(0.7).hex(),
    emptyStackBorder: Color(colors.darkBlue).lighten(0.5).hex(),
    warning: colors.yellow,
    error: colors.red,
    success: colors.blue,
  },
  dark: {
    primary: colors.yellow,
    text: colors.white,
    link: colors.yellow,
    background: colors.black,
    skeleton: Color(colors.black).lighten(0.5).rgb().string(),
    skeletonPulse: Color(colors.black).lighten(0.45).rgb().string(),
    skeletonCard: Color(colors.black).lighten(0.3).rgb().string(),
    buttonBackground: colors.black,
    buttonText: colors.white,
    drawerDragBarPassive: dragBarPassiveDark,
    drawerDragBarActive: Color(colors.black).lighten(0.25).hex(),
    inputOutline: colors.white,
    placeholder: Color(colors.white).alpha(0.5).rgb().string(),
    changesIndicator: colors.yellow,
    switchTrackTrue: colors.yellow,
    switchTrackFalse: dragBarPassiveDark,
    switchThumb: colors.white,
    textureBackgroundStop1: Color(textureBackground.stop1).darken(0.2).hex(),
    textureBackgroundStop2: Color(textureBackground.stop2).darken(0.6).hex(),
    textureBackgroundStop3: Color(textureBackground.stop3).darken(0.7).hex(),
    emptyStackBorder: colors.white,
    warning: colors.yellow,
    error: colors.red,
    success: colors.blue,
  },
};

export type ThemeObject = typeof themes.light & typeof themes.dark;
export type ThemeObjectKey = keyof ThemeObject;
export type ThemeObjectValue<K extends ThemeObjectKey> = ThemeObject[K];

export const fixed = {
  shadow: Color(colors.black).alpha(0.5).rgb().string(),
  cardPresets: {
    black: colors.black,
    white: colors.white,
    // For when the user unsets a smart default we set
    builtInTemplatesFallbackColor: colors.yellow,
    // Kinda want this to stand out against the other preset options
    newDeck: colors.turquoise,
    smartNewDeckColors: [
      "#C5F263",
      "#CBDBA7",
      "#F2D857",
      "#ECC199",
      "#F27979",
      "#F2358D",
      "#85B4F2",
      "#76C1C3",
    ],
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
    border: themes.light.inputOutline,
    card: themes.light.background,
    notification: themes.light.changesIndicator,
    primary: themes.light.primary,
    text: themes.light.text,
  },
  dark: {
    background: themes.dark.background,
    border: themes.dark.inputOutline,
    card: themes.dark.background,
    notification: themes.dark.changesIndicator,
    primary: themes.dark.primary,
    text: themes.dark.text,
  },
};
