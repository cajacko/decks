import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  width: number;
  style?: StyleProp<ViewStyle>;
}

export default function Card(props: CardProps): React.ReactNode {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          width: props.width,
          height: Math.round(props.width * 1.4),
          borderRadius: Math.round(props.width / 20),
        },
        props.style,
      ])}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
