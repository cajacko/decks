import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

export interface CardProps {
  width?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

const defaultWidth = 200;

export const getCardHeight = (width: number | null): number =>
  Math.round((width ?? defaultWidth) * 1.4);

export default function Card({
  style,
  width = defaultWidth,
  children,
  ...rest
}: CardProps): React.ReactNode {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        {
          width: width,
          height: getCardHeight(width),
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
