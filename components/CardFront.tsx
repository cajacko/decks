import React from "react";
import Card, { CardProps } from "./Card";
import { selectCard } from "@/store/slices/cards";
import { useAppSelector } from "@/store/hooks";
import { Text, StyleSheet } from "react-native";

export interface CardFrontProps extends Pick<CardProps, "style" | "children"> {
  cardId: string;
}

export default function CardFront({
  cardId,
  style,
  children,
  ...rest
}: CardFrontProps): React.ReactNode {
  const card = useAppSelector((state) => selectCard(state, { cardId }));

  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  return (
    <Card {...rest} style={StyleSheet.flatten([style, styles.container])}>
      <Text style={styles.text}>{card.cardId} (front)</Text>
      {children}
    </Card>
  );
}

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
