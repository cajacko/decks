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
}

export default function Button({
  title,
  style,
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText } = useThemeColors();

  const { button, text } = React.useMemo(
    () => ({
      button: [
        styles.button,
        {
          backgroundColor: buttonBackground,
        },
        style,
      ],
      text: {
        color: buttonText,
      },
    }),
    [buttonText, buttonBackground, style],
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
  button: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    elevation: 5,
  },
});
