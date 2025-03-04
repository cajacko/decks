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
  variant?: "filled" | "transparent";
}

export default function Button({
  title,
  style,
  color = "primary",
  variant = "filled",
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText } = useThemeColors();

  const { button, text } = React.useMemo(
    () => ({
      button: [
        variant === "transparent" && styles.transparent,
        variant === "filled" && styles.filled,
        variant === "filled" && {
          backgroundColor: buttonBackground,
        },
        style,
      ],
      text: {
        color: buttonText,
      },
    }),
    [buttonText, buttonBackground, style, variant],
  );

  return (
    <TouchableOpacity {...props} style={button}>
      <ThemedText style={text} type="button">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filled: {
    padding: 10,
  },
  transparent: {},
});
