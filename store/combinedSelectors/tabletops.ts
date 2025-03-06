import { createCachedSelector } from "re-reselect";
import { selectTabletop } from "../slices/tabletop";
import { RootState, Decks, Tabletops } from "../types";

type TabletopProps = { tabletopId: Tabletops.TabletopId };

export const selectTabletopAvailableDeckCards = createCachedSelector(
  (state: RootState, props: TabletopProps) =>
    selectTabletop(state, props)?.availableDecks,
  (state: RootState) => state.decks.decksById,
  (availableDecks, decksById): Decks.Card[] | null => {
    if (!availableDecks) return null;

    const cards: Decks.Card[] = [];

    availableDecks.forEach((deckId) => {
      const deck = decksById[deckId];

      if (!deck) return;

      deck.cards.forEach((card) => {
        cards.push(card);
      });
    });

    return cards;
  },
)((_, props) => props.tabletopId);
