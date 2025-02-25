import { Cards } from "@/store/types";
import { useContextSelector } from "use-context-selector";
import * as Types from "./EditCard.types";
import Context from "./EditCard.context";

// NOTE: Defined here to keep all logic that directly accesses the context in the same dir, so it's
// easier for us to make performance optimisations in one place
export default function useEditCardSideState(
  side: Cards.Side,
): Types.EditDataValueMap | undefined {
  return useContextSelector(Context, (context) => context?.state[side]);
}
