import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacityProps,
} from "react-native";
import IconSymbol, { IconSymbolName } from "@/components/IconSymbol";
import { useThemeColors } from "@/hooks/useThemeColor";

export interface CardActionProps extends TouchableOpacityProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  size?: number;
  variant?: "filled" | "transparent";
}

export default function CardAction({
  icon,
  style: styleProp,
  size = 80,
  variant = "filled",
  ...props
}: CardActionProps): React.ReactNode {
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

  return (
    <TouchableOpacity {...props} style={style}>
      <IconSymbol
        name={icon}
        color={text}
        size={variant === "filled" ? (size * 2) / 3 : size}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filled: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
