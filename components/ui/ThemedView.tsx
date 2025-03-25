import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps;

export default function ThemedView({
  style: styleProp,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor("background");

  const style = React.useMemo(
    () => StyleSheet.flatten([{ backgroundColor }, styleProp]),
    [backgroundColor, styleProp],
  );

  return <View style={style} {...otherProps} />;
}
