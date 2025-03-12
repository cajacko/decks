import { Cards } from "@/store/types";
import { useContextSelector } from "./useContextSelector";
import useIsContextTarget from "./useIsContextTarget";
import { Target } from "@/utils/cardTarget";
import { Values } from "@/components/Template/Template.types";

// NOTE: Defined here to keep all logic that directly accesses the context in the same dir, so it's
// easier for us to make performance optimisations in one place
export default function useEditCardSideState(
  side: Cards.Side,
  target?: Target,
): Values | undefined {
  const isContextTarget = useIsContextTarget(target);
  const sideState = useContextSelector(
    (context) => context?.state?.resolvedDataValues[side],
  );

  if (!isContextTarget) return undefined;

  return sideState;
}
