import { selectDeck } from "@/store/selectors/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { useAppSelector } from "@/store/hooks";

export default function useDeckName(deckId?: string | null) {
  const deckName = useAppSelector(
    (state) => deckId && selectDeck(state, { deckId })?.name,
  );

  return deckNameWithFallback(deckName);
}
