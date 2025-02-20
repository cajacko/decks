import React from "react";
import Card, { CardProps } from "./Card";
import { StyleSheet } from "react-native";

export interface CardSpacerProps extends CardProps {}

// Used to allow room for cards that are absolutely positioned
export default function CardSpacer(props: CardSpacerProps): React.ReactNode {
  return (
    <Card
      {...props}
      style={StyleSheet.flatten([props.style, styles.container])}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    opacity: 0,
    zIndex: -1,
    position: "relative",
  },
});
