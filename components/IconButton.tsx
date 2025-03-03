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

export interface CardActionProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableOpacityProps["onPress"];
  size?: number;
}

export default function CardAction({
  icon,
  style: styleProp,
  onPress,
  size = 80,
}: CardActionProps): React.ReactNode {
  const { background, text } = useThemeColors();

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
        styleProp,
      ]),
    [styleProp, size, background],
  );

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <IconSymbol name={icon} color={text} size={(size * 2) / 3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
