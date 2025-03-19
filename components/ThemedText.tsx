import {
  Text,
  type TextProps,
  StyleSheet,
  TextStyle,
  StyleProp,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Theme as NavigationTheme,
  DefaultTheme,
} from "@react-navigation/native";
import React from "react";

export type ThemedTextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body1"
  | "body2"
  | "button"
  | "link";

export type ThemedTextProps = TextProps & {
  type?: ThemedTextVariant;
};

export const navigationFonts: NavigationTheme["fonts"] = DefaultTheme.fonts;

export function useThemedTextStyle({
  type = "body1",
  style: styleProp,
}: Partial<ThemedTextProps>): StyleProp<TextStyle> {
  const color = useThemeColor(type === "link" ? "link" : "text");

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        { color },
        type === "body1" ? styles.body1 : undefined,
        type === "body2" ? styles.body2 : undefined,
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "h4" ? styles.h4 : undefined,
        type === "button" ? styles.button : undefined,
        styleProp,
      ]),
    [styleProp, type, color],
  );

  return style;
}

export default function ThemedText({
  style: styleProp,
  type,
  ...rest
}: ThemedTextProps) {
  const style = useThemedTextStyle({
    type,
    style: styleProp,
    ...rest,
  });

  return <Text {...rest} style={style} />;
}

export const styles = StyleSheet.create({
  body1: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Roboto, sans-serif",
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Roboto, sans-serif",
  },
  h1: {
    fontSize: 30,
    fontWeight: "normal",
    fontFamily: "Roboto, sans-serif",
  },
  h2: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "normal",
    fontFamily: "Roboto, sans-serif",
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "normal",
    fontFamily: "Roboto, sans-serif",
  },
  h4: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "normal",
    fontFamily: "Roboto, sans-serif",
  },
  button: {
    lineHeight: 30,
    fontSize: 16,
    textTransform: "uppercase",
    fontFamily: "Roboto, sans-serif",
  },
});
