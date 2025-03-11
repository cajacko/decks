import { useContextSelector } from "./useContextSelector";
import { Cards } from "@/store/types";
import useIsContextTarget from "./useIsContextTarget";
import { Target } from "@/utils/cardTarget";

export function useDoesCardSideHaveChanges(
  side: Cards.Side,
  target?: Target,
): boolean | null {
  const hasChanges = useContextSelector(
    (context) => context?.state?.hasChanges?.[side]?.any,
  );

  return hasChanges === undefined ? null : hasChanges;
}

export default function useHasEditCardChanges(target?: Target): boolean | null {
  const isContextTarget = useIsContextTarget(target);

  const hasChanges = useContextSelector(
    (context) => context?.state?.hasChanges?.either,
  );

  if (!isContextTarget) return null;

  return hasChanges === undefined ? null : hasChanges;
}
