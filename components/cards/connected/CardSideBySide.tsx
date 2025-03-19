import React from "react";
import { Target } from "@/utils/cardTarget";
import UICardSideBySide, {
  CardSideBySideProps as BasicProps,
} from "@/components/cards/ui/CardSideBySide";
import { NullBehaviour } from "../types";
import { Cards } from "@/store/types";
import Card from "@/components/cards/connected/Card";
import CardSpacer from "@/components/cards/connected/CardSpacer";
import { CardPhysicalSizeProvider } from "@/components/cards/context/CardPhysicalSize";

export interface ConnectedProps extends Partial<BasicProps> {
  target: Target;
  topSide: Cards.Side;
  nullBehaviour?: NullBehaviour;
}

export default function CardSideBySide({
  target,
  topSide,
  nullBehaviour,
  physicalSize,
  sizePreset,
  ...cardSideBySideProps
}: ConnectedProps): React.ReactNode {
  return (
    <CardPhysicalSizeProvider
      target={target}
      physicalSize={physicalSize}
      sizePreset={sizePreset}
      debugLocation={CardSideBySide.name}
    >
      <UICardSideBySide {...cardSideBySideProps}>
        <Card target={target} side={topSide} />
        <Card target={target} side={topSide === "front" ? "back" : "front"} />
        <CardSpacer target={target} />
      </UICardSideBySide>
    </CardPhysicalSizeProvider>
  );
}
