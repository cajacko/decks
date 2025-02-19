import React from "react";
import { Text, StyleSheet } from "react-native";
import Card from "./Card";

export interface EmptyStackProps {
  cardWidth?: number;
}

export default function EmptyStack({
  cardWidth,
}: EmptyStackProps): React.ReactNode {
  return (
    <Card style={styles.container} width={cardWidth}>
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
