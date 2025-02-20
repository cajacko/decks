import React from "react";
import { CardProps } from "./Card";
import { CardInstanceState, selectCardInstance } from "@/store/slices/tabletop";
import { useAppSelector } from "@/store/hooks";
import { CardRef } from "./Card";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import { useTabletopContext } from "./Tabletop/Tabletop.context";

export interface CardInstanceProps
  extends Pick<CardProps, "style" | "children" | "onAnimationChange"> {
  cardInstanceId: string;
}

const CardInstance = React.forwardRef<CardRef, CardInstanceProps>(
  ({ cardInstanceId, ...rest }, ref) => {
    const { tabletopId } = useTabletopContext();
    const cardInstance = useAppSelector((state) =>
      selectCardInstance(state, { cardInstanceId, tabletopId })
    );

    if (!cardInstance) {
      throw new Error(`Card instance with id ${cardInstanceId} not found`);
    }

    const { cardId, state } = cardInstance;

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
