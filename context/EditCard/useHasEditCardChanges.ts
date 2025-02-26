import React from "react";
import { useContextSelector } from "./useContextSelector";
import { Cards } from "@/store/types";
import useIsContextTarget from "./useIsContextTarget";
import { Target } from "@/utils/cardTarget";

function useDoesCardSideHaveChanges(
  side: Cards.Side,
  target?: Target,
): boolean | null {
  const hasChangesMap = useContextSelector(
    (context) => context?.state?.hasChanges[side],
  );

  const hasChanges = React.useMemo(
    (): boolean | null =>
      hasChangesMap
        ? Object.values(hasChangesMap).some((hasChanges) => !!hasChanges)
        : null,
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
