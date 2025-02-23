import React from "react";
import Card, { CardProps, CardRef } from "./Card";
import CardTemplate from "./CardTemplate";

export interface CardSideProps extends CardProps {
  cardId: string;
  side: "front" | "back";
}

export default React.forwardRef<CardRef, CardSideProps>(function CardFront(
  { cardId, side, children, ...rest },
  ref,
) {
  return (
    <Card {...rest} ref={ref}>
      <CardTemplate cardId={cardId} side={side} />
      {children}
    </Card>
  );
});
