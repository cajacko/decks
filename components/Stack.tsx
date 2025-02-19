import React from "react";
import { View, StyleSheet } from "react-native";
import Card from "./Card";

export interface StackProps {
  children?: React.ReactNode;
}

export default function Stack(props: StackProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <Card style={[styles.card, styles.topCard]} />
      <Card style={[styles.card, styles.secondCard]} />
      <Card style={[styles.card, styles.thirdCard]} />
    </View>
  );
}

{
  /* <View style={[styles.card, { transform: [{ rotate: "45deg" }] }]} /> */
}

const styles = StyleSheet.create({
  container: {},
  card: {},
  topCard: {
    position: "relative",
    zIndex: 3,
  },
  secondCard: {
    position: "absolute",
    top: -2,
    left: 2,
    transform: [{ rotate: "3deg" }],
    zIndex: 2,
  },
  thirdCard: {
    position: "absolute",
    top: 2,
    left: -2,
    transform: [{ rotate: "-3deg" }],
    zIndex: 1,
  },
});
