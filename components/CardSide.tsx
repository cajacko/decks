import React from "react";
import Card, { CardProps, CardRef } from "./Card";
import CardTemplate, { CardTemplateProps } from "./CardTemplate";

export type CardSideProps = CardTemplateProps & {
  CardProps?: CardProps;
  skeleton?: boolean;
};

export default React.forwardRef<CardRef, CardSideProps>(function CardSide(
  { CardProps, skeleton, ...cardTemplateProps },
  ref,
) {
  const { children, ...rest } = CardProps ?? {};

  return (
    <Card {...rest} ref={ref}>
      {!skeleton && <CardTemplate {...cardTemplateProps} />}
      {children}
    </Card>
  );
});
