import React from "react";
import ThemedText, { ThemedTextProps } from "../ui/ThemedText";
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import useVibrate from "@/hooks/useVibrate";
import IconSymbol, { IconSymbolName } from "../ui/IconSymbol";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: "primary" | "secondary" | "danger";
  variant?: "filled" | "transparent" | "outline";
  vibrate?: boolean;
  rightIcon?: IconSymbolName;
  ThemedTextProps?: Partial<ThemedTextProps>;
}

export default function Button({
  title,
  style,
  color = "primary",
  variant = "filled",
  vibrate: shouldVibrate = false,
  onPress: onPressProp,
  rightIcon,
  ThemedTextProps,
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText, inputOutline } = useThemeColors();
  const { vibrate } = useVibrate();
  const hasRightIcon = !!rightIcon;

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
        { justifyContent: hasRightIcon ? "space-between" : "center" },
      ],
      text: [
        styles.text,
        {
          color: buttonText,
        },
        ThemedTextProps?.style,
      ],
    }),
    [
      buttonText,
      buttonBackground,
      style,
      variant,
      inputOutline,
      ThemedTextProps?.style,
      hasRightIcon,
    ],
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
      <ThemedText type="button" {...ThemedTextProps} style={text}>
        {title}
      </ThemedText>
      {rightIcon && <IconSymbol name={rightIcon} size={20} />}
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
