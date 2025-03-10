import React from "react";
import { useContextSelector } from "./useContextSelector";
import { Cards } from "@/store/types";
import useIsContextTarget from "./useIsContextTarget";
import { Target } from "@/utils/cardTarget";
import { HasChangesMap, HasSideChanges } from "./EditCard.types";

function getHasSideChanges(side: HasSideChanges): boolean {
  return Object.values(side).some((hasChanges) => !!hasChanges);
}

export function getHasChanges(props: HasChangesMap): boolean {
  return getHasSideChanges(props.front) || getHasSideChanges(props.back);
}

export function useDoesCardSideHaveChanges(
  side: Cards.Side,
  target?: Target,
): boolean | null {
  const hasChangesMap = useContextSelector(
    (context) => context?.state?.hasChanges[side],
  );

  const hasChanges = React.useMemo(
    (): boolean | null =>
      hasChangesMap ? getHasSideChanges(hasChangesMap) : null,
    [hasChangesMap],
  );

  return hasChanges;
}

export default function useHasEditCardChanges(target?: Target): boolean | null {
  const isContextTarget = useIsContextTarget(target);
  const frontHasChanges = useDoesCardSideHaveChanges("front", target);
  const backHasChanges = useDoesCardSideHaveChanges("back", target);

  if (!isContextTarget) return null;

  return frontHasChanges || backHasChanges;
}
