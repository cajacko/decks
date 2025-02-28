import { deleteDeck } from "../combinedActions/decks";
import { store } from "../store";
import { selectDeck } from "../slices/decks";
import { Cards, Decks } from "../types";

export function deleteDeckHelper(props: {
  deckId: Decks.DeckId;
  cardIds?: Cards.CardId[];
  tabletopId?: string;
}) {
  const deck = selectDeck(store.getState(), props);

  const cardIds: Cards.CardId[] =
    props.cardIds ?? deck?.cards.map(({ cardId }) => cardId) ?? [];

  const tabletopId = deck?.defaultTabletopId ?? props.tabletopId ?? null;

  return deleteDeck({ cardIds, deckId: props.deckId, tabletopId });
}
