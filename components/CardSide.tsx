import React from "react";
import { StyleSheet } from "react-native";
import Card, { CardProps, CardRef } from "./Card";
import CardTemplate from "./CardTemplate";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";

export interface CardSideProps extends CardProps {
  cardId: string;
  side: "front" | "back";
}

export default React.forwardRef<CardRef, CardSideProps>(function CardFront(
  { cardId, side, children, style, ...rest },
  ref,
) {
  const template = useAppSelector((state) =>
    selectCardTemplate(state, { cardId, side }),
  );

  const cardStyle = React.useMemo(
    () =>
      template?.backgroundColor
        ? StyleSheet.flatten([
            { backgroundColor: template?.backgroundColor },
            style,
          ])
        : style,
    [style, template?.backgroundColor],
  );

  return (
    <Card {...rest} style={cardStyle} ref={ref}>
      <CardTemplate cardId={cardId} side={side} />
      {children}
    </Card>
  );
});
