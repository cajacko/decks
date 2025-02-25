import React from "react";
import { useRequiredContextSelector } from "./useContextSelector";
import { Cards } from "@/store/types";

function useDoesCardSideHaveChanges(side: Cards.Side): boolean {
  const hasChangesMap = useRequiredContextSelector(
    (context) => context?.state.hasChanges[side],
  );

  return React.useMemo(
    (): boolean =>
      Object.values(hasChangesMap).some((hasChanges) => !!hasChanges),
    [hasChangesMap],
  );
}

export default function useHasEditCardChanges(): boolean {
  const frontHasChanges = useDoesCardSideHaveChanges("front");
  const backHasChanges = useDoesCardSideHaveChanges("back");

  return frontHasChanges || backHasChanges;
}
