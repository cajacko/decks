import React from "react";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  TouchableHighlightProps,
} from "react-native";

export interface CardActionProps {
  icon: string;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableHighlightProps["onPress"];
}

export default function CardAction({
  icon,
  style,
  onPress,
}: CardActionProps): React.ReactNode {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={StyleSheet.flatten([styles.container, style])}
    >
      <Text style={styles.text}>{icon}</Text>
    </TouchableHighlight>
  );
}

export const size = 80;

const styles = StyleSheet.create({
  container: {
    height: size,
    width: size,
    backgroundColor: "white",
    borderRadius: Math.round(size / 2),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
