import React from "react";
import { useMmToDp } from "../context/PhysicalMeasures";
import UICardContainer, {
  CardContainerProps as UICardContainerProps,
  CardSize,
} from "../ui/CardContainer";
import { useCardsPhysicalSize } from "../context/CardPhysicalSize";
import {
  withCardTargetProvider,
  Target,
} from "@/components/cards/context/CardTarget";

export interface UseCardContainerSizeProps {
  // If you're passing a size prop, don't use the connected card
  // size?: CardSize;
  shadow?: boolean;
  target: Target;
}

export interface CardContainerProps
  extends Partial<Omit<UICardContainerProps, "shadow">>,
    UseCardContainerSizeProps {}

const boxShadowConfig = {
  min: 1,
  roundToNumberOfDecimals: 1,
};

export function useCardContainerSizeProps({
  shadow = true,
  target,
}: UseCardContainerSizeProps): CardSize {
  const { mmBorderRadius, mmHeight, mmWidth } = useCardsPhysicalSize({
    debugLocation: useCardContainerSizeProps.name,
    target,
  });

  const mmToDp = useMmToDp();

  return React.useMemo<CardSize>(
    () => ({
      height: mmToDp(mmHeight, { roundToNumberOfDecimals: 1 }),
      width: mmToDp(mmWidth, { roundToNumberOfDecimals: 1 }),
      borderRadius: mmToDp(mmBorderRadius, { roundToNumberOfDecimals: 1 }),
      shadow: shadow
        ? {
            x: -mmToDp(1, boxShadowConfig),
            y: mmToDp(1, boxShadowConfig),
            blur: mmToDp(2, boxShadowConfig),
          }
        : undefined,
    }),
    [mmHeight, mmWidth, mmBorderRadius, mmToDp, shadow],
  );
}

function CardContainer({
  shadow,
  target,
  ...props
}: CardContainerProps): React.ReactNode {
  const cardSize = useCardContainerSizeProps({
    shadow,
    target,
  });

  return <UICardContainer {...cardSize} {...props} />;
}

export default withCardTargetProvider(CardContainer);
