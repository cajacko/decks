import React from "react";
import { withCardSpacer } from "../ui/CardSpacer";
import UICardContainer, {
  CardContainerProps as UICardContainerProps,
} from "@/components/cards/ui/CardContainer";
import { useCardContainerSizeProps } from "./CardContainer";
import { Cards } from "@/store/types";

export const defaultCardSizePreset = Cards.Size.Poker;

export interface CardSkeletonProps
  extends Omit<UICardContainerProps, "height" | "width"> {
  sizePreset?: Cards.Size;
}

function CardContainer({
  sizePreset = defaultCardSizePreset,
  ...cardProps
}: CardSkeletonProps): React.ReactNode {
  const cardSize = useCardContainerSizeProps({
    shadow: false,
    sizePreset,
  });

  return <UICardContainer {...cardSize} {...cardProps} />;
}

export default withCardSpacer<CardSkeletonProps>(CardContainer);
