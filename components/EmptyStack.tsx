import React from "react";
import { Text, StyleSheet } from "react-native";
import Card, { CardProps } from "./Card";

export interface EmptyStackProps extends Pick<CardProps, "style"> {
  cardWidth: number;
  cardHeight: number;
}

export default function EmptyStack({
  cardWidth,
  cardHeight,
  style,
}: EmptyStackProps): React.ReactNode {
  return (
    <Card
      style={StyleSheet.flatten([styles.container, style])}
      width={cardWidth}
      height={cardHeight}
    >
      <Text style={styles.text}>Empty Stack</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#f0f0f0",
    borderStyle: "dashed",
    backgroundColor: "#ffffff2b",
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
