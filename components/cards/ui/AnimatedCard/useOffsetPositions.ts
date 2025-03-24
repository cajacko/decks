import React from "react";
import { OffsetPosition } from "./AnimatedCard.types";
import { useOptionalTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import { selectTabletopSettings } from "@/store/combinedSelectors/tabletops";
import { useAppSelector } from "@/store/hooks";
import {
  MmToDp,
  useMmToDp,
  UseMmToDpProps,
} from "../../context/PhysicalMeasures";

const offsetConfig = {
  min: 1,
  roundToNumberOfDecimals: 1,
};

const offsetSpread = 0.5;

/**
 * Define the minimum amount needed for a stack to look good, so we're not rendering loads of cards
 * in stack.
 */
export function getOffsetPositions(mmToDp: MmToDp): OffsetPosition[] {
  return [
    null,
    {
      y: -mmToDp(offsetSpread * 1, offsetConfig),
      x: mmToDp(offsetSpread * 2, offsetConfig),
      rotate: 0.6,
    },
    {
      y: mmToDp(offsetSpread * 1.5, offsetConfig),
      x: -mmToDp(offsetSpread * 1, offsetConfig),
      rotate: -1.2,
    },
    {
      y: -mmToDp(offsetSpread * 2, offsetConfig),
      x: mmToDp(offsetSpread * 2.2, offsetConfig),
      rotate: 1.2,
    },
    {
      y: mmToDp(offsetSpread * 1.8, offsetConfig),
      x: -mmToDp(offsetSpread * 1.5, offsetConfig),
      rotate: -0.6,
    },
  ];
}

export default function useOffsetPositions(props?: UseMmToDpProps) {
  const mmToDp = useMmToDp(props);
  const { tabletopId } = useOptionalTabletopContext() ?? {};
  const preferNeatStacks = useAppSelector((state) =>
    tabletopId
      ? selectTabletopSettings(state, { tabletopId })?.preferNeatStacks
      : undefined,
  );

  const canUseOffsets = preferNeatStacks !== true;

  const offsetPositions = React.useMemo(
    () => getOffsetPositions(mmToDp),
    [mmToDp],
  );

  return canUseOffsets ? offsetPositions : null;
}
