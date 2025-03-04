import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Theme as NavigationTheme,
  DefaultTheme,
} from "@react-navigation/native";
import React from "react";

export type ThemedTextVariant =
  | "h1"
  | "h3"
  | "h4"
  | "body1"
  | "button"
  | "link";

export type ThemedTextProps = TextProps & {
  type?: ThemedTextVariant;
};

export const navigationFonts: NavigationTheme["fonts"] = DefaultTheme.fonts;

export function useThemedTextStyle({
  type = "body1",
  style: styleProp,
}: Partial<ThemedTextProps>) {
  const color = useThemeColor(type === "link" ? "link" : "text");

  const style = React.useMemo(
    () => [
      { color },
      type === "body1" ? styles.body1 : undefined,
      type === "h1" ? styles.h1 : undefined,
      type === "h3" ? styles.h3 : undefined,
      type === "h4" ? styles.h4 : undefined,
      type === "button" ? styles.button : undefined,
      styleProp,
    ],
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

const styles = StyleSheet.create({
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  h1: {
    fontSize: 30,
    lineHeight: 24,
    fontWeight: "normal",
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "normal",
  },
  h4: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "normal",
  },
  button: {
    lineHeight: 30,
    fontSize: 16,
    textTransform: "uppercase",
  },
});
