import React from "react";
import ThemedText from "./ThemedText";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: "primary" | "secondary" | "danger";
  variant?: "filled" | "transparent" | "outline";
}

export default function Button({
  title,
  style,
  color = "primary",
  variant = "filled",
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText, inputOutline } = useThemeColors();

  const { button, text } = React.useMemo(
    () => ({
      button: [
        styles.button,
        variant !== "transparent" && styles.padding,
        variant === "transparent" && styles.transparent,
        variant === "filled" && styles.filled,
        variant === "filled" && {
          backgroundColor: buttonBackground,
        },
        variant === "outline" && styles.outline,
        variant === "outline" && {
          borderColor: inputOutline,
        },
        style,
      ],
      text: [
        styles.text,
        {
          color: buttonText,
        },
      ],
    }),
    [buttonText, buttonBackground, style, variant, inputOutline],
  );

  return (
    <TouchableOpacity {...props} style={button}>
      <ThemedText style={text} type="button">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
  },
  padding: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  filled: {},
  transparent: {},
  outline: {
    borderWidth: 1,
  },
  text: {
    textAlign: "center",
  },
});
