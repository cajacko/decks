import React from "react";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableHighlightProps,
} from "react-native";

export interface CardActionProps {
  icon: string;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableHighlightProps["onPress"];
  active?: boolean;
  size?: number;
}

export default function IconButton({
  icon,
  style,
  onPress,
  active,
  size = 100,
}: CardActionProps): React.ReactNode {
  return (
    <TouchableHighlight
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: active ? "lightgray" : "white",
          height: size,
          width: size,
          borderRadius: Math.round(size / 2),
        },
        style,
      ])}
    >
      <Text style={styles.text}>{icon}</Text>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
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
