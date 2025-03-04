import { Text, type TextProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Theme as NavigationTheme,
  DefaultTheme,
} from "@react-navigation/native";
import React from "react";

export type ThemedTextProps = TextProps & {
  type?: "h3" | "body1" | "button" | "link";
};

export const navigationFonts: NavigationTheme["fonts"] = DefaultTheme.fonts;

export default function ThemedText({
  style: styleProp,
  type = "body1",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(type === "link" ? "link" : "text");

  const style = React.useMemo(
    () => [
      { color },
      type === "body1" ? styles.body1 : undefined,
      type === "h3" ? styles.h3 : undefined,
      type === "button" ? styles.button : undefined,
      styleProp,
    ],
    [styleProp, type, color],
  );

  return <Text style={style} {...rest} />;
}

const styles = StyleSheet.create({
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "normal",
  },
  button: {
    lineHeight: 30,
    fontSize: 16,
    textTransform: "uppercase",
  },
});
