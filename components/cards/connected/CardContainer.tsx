import React from "react";
import { useMmToDp, UseMmToDpProps } from "../context/PhysicalMeasures";
import UICardContainer, {
  CardContainerProps as UICardContainerProps,
  CardSize,
} from "../ui/CardContainer";
import {
  useCardsPhysicalSize,
  UseCardsPhysicalSizeProps,
} from "../context/CardPhysicalSize";
import { CardPhysicalSizeProvider } from "../context/CardPhysicalSize";

export interface UseCardContainerSizeProps
  extends UseMmToDpProps,
    UseCardsPhysicalSizeProps {
  // If you're passing a size prop, don't use the connected card
  // size?: CardSize;
  shadow?: boolean;
}

export interface CardContainerProps
  extends Partial<Omit<UICardContainerProps, "shadow">>,
    Omit<UseCardContainerSizeProps, "debugLocation"> {}

const boxShadowConfig = {
  min: 1,
  roundToNumberOfDecimals: 1,
};

export function useCardContainerSizeProps({
  shadow = true,
  ...props
}: UseCardContainerSizeProps): CardSize {
  const { mmBorderRadius, mmHeight, mmWidth } = useCardsPhysicalSize(props);
  const mmToDp = useMmToDp(props);

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

export default function CardContainer({
  physicalSize,
  sizePreset,
  shadow,
  target,
  ...props
}: CardContainerProps): React.ReactNode {
  const cardSize = useCardContainerSizeProps({
    physicalSize,
    sizePreset,
    shadow,
    target,
    debugLocation: CardContainer.name,
  });

  return (
    <CardPhysicalSizeProvider
      physicalSize={physicalSize}
      target={target}
      sizePreset={sizePreset}
      debugLocation={CardContainer.name}
    >
      <UICardContainer {...cardSize} {...props} />
    </CardPhysicalSizeProvider>
  );
}
