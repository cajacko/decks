import React from "react";
import Card, { CardProps } from "./Card";
import { selectCard } from "@/store/slices/cards";
import { useAppSelector } from "@/store/hooks";
import { StyleSheet } from "react-native";

export interface CardBackProps extends Pick<CardProps, "style"> {
  cardId: string;
}

export default function CardBack({
  cardId,
  style,
  ...rest
}: CardBackProps): React.ReactNode {
  const card = useAppSelector((state) => selectCard(state, { cardId }));

  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  return (
    <Card {...rest} style={StyleSheet.flatten([style, styles.container])} />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
});
