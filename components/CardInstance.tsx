import React from "react";
import { CardProps } from "./Card";
import { CardInstanceState } from "@/store/slices/stacks";
import CardFront from "./CardFront";
import CardBack from "./CardBack";

export interface CardInstanceProps
  extends Pick<CardProps, "style" | "width" | "children"> {
  cardId: string;
  state: CardInstanceState;
}

export default function CardInstance({
  cardId,
  state,
  ...rest
}: CardInstanceProps): React.ReactNode {
  if (state === CardInstanceState.faceUp) {
    return <CardFront cardId={cardId} {...rest} />;
  }

  if (state === CardInstanceState.faceDown) {
    return <CardBack cardId={cardId} {...rest} />;
  }

  throw new Error(`Invalid card state: ${state}`);
}
