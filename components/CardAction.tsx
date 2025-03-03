import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableHighlightProps,
} from "react-native";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";
import IconSymbol, { IconSymbolName } from "@/components/IconSymbol";
import { useThemeColors } from "@/hooks/useThemeColor";

export interface CardActionProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableHighlightProps["onPress"];
  active?: boolean;
}

export default function CardAction({
  icon,
  style: styleProp,
  onPress,
  active,
}: CardActionProps): React.ReactNode {
  const { buttonSize } = useTabletopContext();
  const { background, text } = useThemeColors();

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          height: buttonSize,
          width: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: background,
          opacity: active ? 1 : 0.5,
        },
        styleProp,
      ]),
    [styleProp, buttonSize, background, active],
  );

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <IconSymbol name={icon} color={text} size={(buttonSize * 2) / 3} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
