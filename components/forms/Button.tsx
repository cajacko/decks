import React from "react";
import ThemedText, { ThemedTextProps } from "../ui/ThemedText";
import { StyleSheet } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import IconSymbol, { IconSymbolName } from "../ui/IconSymbol";
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from "@/components/ui/Pressables";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  color?: "primary" | "secondary" | "danger";
  variant?: "filled" | "transparent" | "outline";
  vibrate?: boolean;
  rightIcon?: IconSymbolName;
  ThemedTextProps?: Partial<ThemedTextProps>;
}

export type UseOnPressProps = Pick<ButtonProps, "onPress" | "vibrate">;

export default function Button({
  title,
  color = "primary",
  variant = "filled",
  rightIcon,
  ThemedTextProps,
  style,
  ...props
}: ButtonProps): React.ReactNode {
  const { buttonBackground, buttonText, inputOutline } = useThemeColors();
  const hasRightIcon = !!rightIcon;

  const { button, buttonContentContainer, text } = React.useMemo(
    () => ({
      button: [styles.button, style],
      buttonContentContainer: [
        styles.buttonContentContainer,
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
      style,
      buttonText,
      buttonBackground,
      variant,
      inputOutline,
      ThemedTextProps?.style,
      hasRightIcon,
    ],
  );

  return (
    <TouchableOpacity
      {...props}
      style={button}
      contentContainerStyle={buttonContentContainer}
    >
      <ThemedText type="button" {...ThemedTextProps} style={text}>
        {title}
      </ThemedText>
      {rightIcon && <IconSymbol name={rightIcon} size={20} />}
    </TouchableOpacity>
  );
}

/**
 * Transparent buttons in alerts aren't working nicely without a height. This also lets us be more
 * consistent
 */
const height = 40;

export const styles = StyleSheet.create({
  button: {
    height,
  },
  buttonContentContainer: {
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  padding: {
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
