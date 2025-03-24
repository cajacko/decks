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
import useVibrate from "@/hooks/useVibrate";

export interface IconButtonProps extends TouchableOpacityProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  size?: number;
  variant?: "filled" | "transparent";
  vibrate?: boolean;
}

const defaultSize = 80;

export default function IconButton({
  icon,
  style: styleProp,
  size = defaultSize,
  variant = "filled",
  vibrate: shouldVibrate = false,
  onPress: onPressProp,
  ...props
}: IconButtonProps): React.ReactNode {
  const { vibrate } = useVibrate();
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

  const onPress = React.useMemo<IconButtonProps["onPress"]>(
    () =>
      onPressProp
        ? (event) => {
            if (shouldVibrate) {
              vibrate?.(`CardAction (${icon})`);
            }

            return onPressProp(event);
          }
        : undefined,
    [onPressProp, vibrate, shouldVibrate, icon],
  );

  return (
    <TouchableOpacity {...props} onPress={onPress} style={style}>
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
