import React from "react";
import UICardSkeleton, {
  CardSkeletonProps as UICardSkeletonProps,
  defaultCardSizePreset,
} from "@/components/cards/ui/CardSkeleton";
import { useCardContainerSizeProps } from "./CardContainer";
import { Cards } from "@/store/types";

export { defaultCardSizePreset };

export interface CardSkeletonProps
  extends Omit<UICardSkeletonProps, "height" | "width"> {
  sizePreset?: Cards.Size;
}

export default function CardSkeleton({
  sizePreset = defaultCardSizePreset,
  ...cardProps
}: CardSkeletonProps): React.ReactNode {
  const cardSize = useCardContainerSizeProps({
    shadow: false,
    sizePreset,
  });

  return (
    <UICardSkeleton sizePreset={sizePreset} {...cardSize} {...cardProps} />
  );
}
