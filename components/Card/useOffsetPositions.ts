import React from "react";
import { getOffsetPositions } from "./card.styles";
import useFlag from "@/hooks/useFlag";
import { CardSizeContextProps } from "./Card.types";
import { useCardSizes } from "./CardSize.context";

export default function useOffsetPositions(
  props?: Partial<CardSizeContextProps>,
) {
  const cardSizes = useCardSizes(props);
  const canUseOffsets = useFlag("STACK_OFFSET_BEHAVIOUR") === "messy";

  const offsetPositions = React.useMemo(
    () => getOffsetPositions(cardSizes),
    [cardSizes],
  );

  return canUseOffsets ? offsetPositions : null;
}
