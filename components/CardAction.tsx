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
import useVibrate from "@/hooks/useVibrate";

export interface CardActionProps {
  icon: IconSymbolName;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableHighlightProps["onPress"];
  active?: boolean;
  vibrate?: boolean;
}

export const defaultOpacity = 0.5;

export default function CardAction({
  icon,
  style: styleProp,
  onPress: onPressProp,
  active,
  vibrate: shouldVibrate = false,
}: CardActionProps): React.ReactNode {
  const { vibrate } = useVibrate();
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
          opacity: active ? 1 : defaultOpacity,
        },
        styleProp,
      ]),
    [styleProp, buttonSize, background, active],
  );

  const onPress = React.useMemo<CardActionProps["onPress"]>(
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
