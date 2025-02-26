import { Target } from "@/utils/cardTarget";
import { useContextSelector } from "./useContextSelector";
import { getIsSameTarget } from "@/utils/cardTarget";

export default function useIsContextTarget(target?: Target): boolean {
  const contextTarget = useContextSelector((context) => context?.state?.target);

  // There's no context or context target defined, so this component can not be a target of the edit
  // card context
  // e.g. When the EditCard context wraps multiple cards (e.g. if we want to edit within the
  // tabletop view), then each card will call this with it's own card as a target, and most won't
  // want the edit context to apply to them
  if (!contextTarget) return false;

  // This component hasn't specified a target so any target in context is valid
  // e.g. When used within an edit route for a specific card where everything in context has the
  // same target
  if (!target) return true;

  return getIsSameTarget(target, contextTarget);
}
