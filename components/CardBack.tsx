import React from "react";
import Card, { CardProps } from "./Card";
import { selectCard } from "@/store/slices/cards";
import { useAppSelector } from "@/store/hooks";
import { StyleSheet, Text } from "react-native";

export interface CardBackProps extends Pick<CardProps, "style" | "children"> {
  cardId: string;
}

export default function CardBack({
  cardId,
  style,
  children,
  ...rest
}: CardBackProps): React.ReactNode {
  const card = useAppSelector((state) => selectCard(state, { cardId }));

  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  return (
    <Card {...rest} style={StyleSheet.flatten([style, styles.container])}>
      <Text style={styles.text}>{card.cardId} (back)</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  text: {
    fontSize: 24,
    color: "white",
  },
});
