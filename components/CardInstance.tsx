import React from "react";
import { CardProps } from "./Card";
import { CardInstanceState } from "@/store/slices/tabletop";
import { CardRef } from "./Card";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

export interface CardInstanceProps
  extends Pick<
    CardProps,
    "style" | "width" | "height" | "children" | "onAnimationChange"
  > {
  cardId: string;
  state: CardInstanceState;
}

const CardInstance = React.forwardRef<CardRef, CardInstanceProps>(
  ({ cardId, state, ...rest }, ref) => {
    if (state === CardInstanceState.faceUp) {
      return <CardFront cardId={cardId} {...rest} ref={ref} />;
    }

    if (state === CardInstanceState.faceDown) {
      return <CardBack cardId={cardId} {...rest} ref={ref} />;
    }

    throw new Error(`Invalid card state: ${state}`);
  }
);

export default CardInstance;
