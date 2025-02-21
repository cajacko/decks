import React from "react";
import Card, { CardProps, CardRef } from "./Card";
import { selectCard } from "@/store/slices/cards";
import { useAppSelector } from "@/store/hooks";
import { Text, StyleSheet } from "react-native";

export interface CardFrontProps extends Pick<CardProps, "style" | "children"> {
  cardId: string;
}

export default React.forwardRef<CardRef, CardFrontProps>(function CardFront(
  { cardId, style, children, ...rest },
  ref,
) {
  const card = useAppSelector((state) => selectCard(state, { cardId }));

  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  return (
    <Card
      {...rest}
      style={StyleSheet.flatten([style, styles.container])}
      ref={ref}
    >
      <Text style={styles.text}>{card.cardId} (front)</Text>
      {children}
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
});
