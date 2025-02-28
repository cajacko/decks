import { Cards, Decks, Tabletops } from "../types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.DeckId;
  cardIds: Cards.CardId[];
  tabletopId: string | null;
}>("deleteDeck");

export const createDeck = createDelayedActionForAnimations<{
  deck: Decks.Props;
  defaultTabletop: Tabletops.Props;
  cards: Cards.Props[];
}>("createDeck");
