import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card, { CardProps, getBorderRadius } from "./Card";
import { useTabletopContext } from "./Tabletop/Tabletop.context";

export type EmptyStackProps = CardProps;

export default function EmptyStack({
  style,
  ...rest
}: EmptyStackProps): React.ReactNode {
  const context = useTabletopContext();

  return (
    <Card style={StyleSheet.flatten([styles.container, style])} {...rest}>
      <View
        style={StyleSheet.flatten([
          styles.content,
          { borderRadius: getBorderRadius(context) },
        ])}
      >
        <Text style={styles.text}>Empty Stack</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    backgroundColor: "transparent",
    position: "relative",
  },
  // Slightly smaller so it doesn't poke out of the cards when in a stack
  content: {
    position: "absolute",
    top: "2%",
    left: "2%",
    right: "2%",
    bottom: "2%",
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
