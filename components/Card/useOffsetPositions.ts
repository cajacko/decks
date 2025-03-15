import React from "react";
import { getOffsetPositions } from "./card.styles";
import { CardSizeContextProps } from "./Card.types";
import { useCardSizes } from "./CardSize.context";
import { useOptionalTabletopContext } from "@/components/Tabletop/Tabletop.context";
import { selectTabletopSettings } from "@/store/slices/tabletop";
import { useAppSelector } from "@/store/hooks";

export default function useOffsetPositions(
  props?: Partial<CardSizeContextProps>,
) {
  const cardSizes = useCardSizes(props);
  const { tabletopId } = useOptionalTabletopContext() ?? {};
  const preferNeatStacks = useAppSelector((state) =>
    tabletopId
      ? selectTabletopSettings(state, { tabletopId })?.preferNeatStacks
      : undefined,
  );

  const canUseOffsets = preferNeatStacks !== true;

  const offsetPositions = React.useMemo(
    () => getOffsetPositions(cardSizes),
    [cardSizes],
  );

  return canUseOffsets ? offsetPositions : null;
}
