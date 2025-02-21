import React from "react";
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableHighlightProps,
} from "react-native";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";

export interface CardActionProps {
  icon: string;
  style?: StyleProp<ViewStyle>;
  onPress?: TouchableHighlightProps["onPress"];
  active?: boolean;
}

export default function CardAction({
  icon,
  style,
  onPress,
  active,
}: CardActionProps): React.ReactNode {
  const { buttonSize } = useTabletopContext();

  return (
    <TouchableHighlight
      onPress={onPress}
      style={StyleSheet.flatten([
        styles.container,
        {
          backgroundColor: active ? "lightgray" : "white",
          height: buttonSize,
          width: buttonSize,
          borderRadius: Math.round(buttonSize / 2),
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
