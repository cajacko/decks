// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import React from "react";
import { StyleProp, ViewStyle, View, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type IconSymbolName = React.ComponentProps<typeof MaterialIcons>["name"];

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export default function IconSymbol({
  name,
  size = 24,
  color,
  style: styleProp,
  rotation,
}: {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  rotation?: number;
}) {
  const themeColor = useThemeColor("text");

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          transform: rotation
            ? [
                {
                  rotate: `${rotation}deg`,
                },
              ]
            : undefined,
        },
        styleProp,
      ]),
    [styleProp, rotation],
  );

  return (
    // NOTE: ios doesn't like us using transforms and stuff on the icons, using it on the view is
    // safer
    <View style={style}>
      <MaterialIcons color={color ?? themeColor} size={size} name={name} />
    </View>
  );
}
