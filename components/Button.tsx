import React from "react";
import ThemedText from "./ThemedText";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import useVibrate from "@/hooks/useVibrate";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: "primary" | "secondary" | "danger";
  variant?: "filled" | "transparent" | "outline";
  vibrate?: boolean;
}

export default function Button({
  title,
  style,
  color = "primary",
  variant = "filled",
  vibrate: shouldVibrate = false,
  onPress: onPressProp,
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText, inputOutline } = useThemeColors();
  const { vibrate } = useVibrate();

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

  const onPress = React.useMemo<ButtonProps["onPress"]>(
    () =>
      onPressProp
        ? (event) => {
            if (shouldVibrate) {
              vibrate?.(`Button (${title})`);
            }

            return onPressProp(event);
          }
        : undefined,
    [onPressProp, vibrate, shouldVibrate, title],
  );

  return (
    <TouchableOpacity {...props} onPress={onPress} style={button}>
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
