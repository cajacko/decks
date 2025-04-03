import React from "react";
import UICardSideBySide, {
  CardSideBySideProps as UICardSideBySideProps,
} from "@/components/cards/ui/CardSideBySide";
import { Cards } from "@/store/types";
import CardSkeleton, {
  defaultCardSizePreset,
} from "@/components/cards/connected/CardSkeleton";
import CardSpacerSkeleton from "@/components/cards/connected/CardSpacerSkeleton";

export interface ConnectedProps extends Partial<UICardSideBySideProps> {
  sizePreset?: Cards.Size;
}

function CardSideBySideSkeleton({
  sizePreset = defaultCardSizePreset,
  ...CardSideBySideSkeletonProps
}: ConnectedProps): React.ReactNode {
  return (
    <UICardSideBySide {...CardSideBySideSkeletonProps} sizePreset={sizePreset}>
      <CardSkeleton sizePreset={sizePreset} />
      <CardSkeleton sizePreset={sizePreset} />
      <CardSpacerSkeleton sizePreset={sizePreset} />
    </UICardSideBySide>
  );
}

export default CardSideBySideSkeleton;
