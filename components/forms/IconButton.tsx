import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
} from "react-native";
import IconSymbol, { IconSymbolName } from "@/components/ui/IconSymbol";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useOnPressProps } from "@/components/forms/Button";

export interface IconButtonProps extends TouchableOpacityProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  size?: number;
  variant?: "filled" | "transparent";
  vibrate?: boolean;
  loading?: boolean;
}

const defaultSize = 80;

export default function IconButton({
  icon,
  style: styleProp,
  size = defaultSize,
  variant = "filled",
  loading = false,
  ...props
}: IconButtonProps): React.ReactNode {
  const { background, text } = useThemeColors();

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        variant === "filled" && styles.filled,
        variant === "filled" && {
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
        styleProp,
      ]),
    [styleProp, size, background, variant],
  );

  const onPressProps = useOnPressProps(props);

  return (
    <TouchableOpacity {...props} {...onPressProps} style={style}>
      <IconSymbol
        name={icon}
        color={text}
        size={variant === "filled" ? (size * 2) / 3 : size}
      />
    </TouchableOpacity>
  );
}

const floatingButtonOffset = 20;

export function getFloatingButtonVerticalAllowance({
  size = defaultSize,
}: Pick<IconButtonProps, "size"> = {}): number {
  return size + floatingButtonOffset * 2;
}

export const styles = StyleSheet.create({
  filled: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  floating: {
    position: "absolute",
    bottom: floatingButtonOffset,
    right: floatingButtonOffset,
  },
});
