import React from "react";
import UICardSideBySide, {
  CardSideBySideProps as UICardSideBySideProps,
} from "@/components/cards/ui/CardSideBySide";
import { Cards } from "@/store/types";
import Card from "@/components/cards/connected/Card";
import CardSpacer from "@/components/cards/connected/CardSpacer";
import {
  Target,
  withCardTargetProvider,
} from "@/components/cards/context/CardTarget";

export interface ConnectedProps extends Partial<UICardSideBySideProps> {
  target: Target;
  topSide: Cards.Side;
}

function CardSideBySide({
  target,
  topSide,
  ...cardSideBySideProps
}: ConnectedProps): React.ReactNode {
  return (
    <UICardSideBySide {...cardSideBySideProps}>
      <Card target={target} side={topSide} />
      <Card target={target} side={topSide === "front" ? "back" : "front"} />
      <CardSpacer target={target} />
    </UICardSideBySide>
  );
}

export default withCardTargetProvider(CardSideBySide);
