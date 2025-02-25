import { Cards } from "@/store/types";
import { useContextSelector } from "./useContextSelector";
import * as Types from "./EditCard.types";

// NOTE: Defined here to keep all logic that directly accesses the context in the same dir, so it's
// easier for us to make performance optimisations in one place
export default function useEditCardSideState(
  side: Cards.Side,
): Types.EditDataValueMap | undefined {
  return useContextSelector((context) => context?.state[side]);
}
