import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  width?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function Card({
  style,
  width = 200,
  children,
  ...rest
}: CardProps): React.ReactNode {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          width: width,
          height: Math.round(width * 1.4),
          borderRadius: Math.round(width / 20),
        },
        style,
      ])}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000", // iOS & Android
    shadowOffset: { width: 0, height: 4 }, // iOS only
    shadowOpacity: 0.2, // iOS only
    shadowRadius: 6, // iOS only
    elevation: 6, // Android only
  },
});
