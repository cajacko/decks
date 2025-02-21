import React from "react";
import Card, { CardProps, CardRef } from "./Card";
import { selectCard } from "@/store/slices/cards";
import { useAppSelector } from "@/store/hooks";
import { StyleSheet, Text } from "react-native";

export interface CardBackProps extends CardProps {
  cardId: string;
}

export default React.forwardRef<CardRef, CardBackProps>(function CardBack(
  { cardId, style, children, ...rest },
  ref,
) {
  const card = useAppSelector((state) => selectCard(state, { cardId }));
  const cardStyle = React.useMemo(
    () => StyleSheet.flatten([styles.container, style]),
    [style],
  );

  if (!card) {
    throw new Error(`Card with id ${cardId} not found`);
  }

  return (
    <Card {...rest} style={cardStyle} ref={ref}>
      <Text style={styles.text}>{card.cardId} (back)</Text>
      {children}
    </Card>
  );
});

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
