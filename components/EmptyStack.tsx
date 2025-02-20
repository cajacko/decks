import React from "react";
import { Text, StyleSheet } from "react-native";
import Card, { CardProps } from "./Card";

export type EmptyStackProps = CardProps;

export default function EmptyStack({
  style,
  ...rest
}: EmptyStackProps): React.ReactNode {
  return (
    <Card style={StyleSheet.flatten([styles.container, style])} {...rest}>
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
