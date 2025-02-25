import React from "react";
import Card, { CardProps, CardRef } from "./Card";
import CardTemplate, { CardTemplateProps } from "./CardTemplate";

export type CardSideProps = CardTemplateProps & {
  CardProps?: CardProps;
};

export default React.forwardRef<CardRef, CardSideProps>(function CardFront(
  { CardProps, side, ...cardOrDeck },
  ref,
) {
  const { children, ...rest } = CardProps ?? {};

  return (
    <Card {...rest} ref={ref}>
      <CardTemplate side={side} {...cardOrDeck} />
      {children}
    </Card>
  );
});
