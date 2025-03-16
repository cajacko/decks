import { Cards, Decks, Tabletops } from "../types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.Id;
  cardIds: Cards.Id[];
  tabletopId: Tabletops.Id | null;
}>("deleteDeck");

export const createDeck = createDelayedActionForAnimations<{
  deck: Decks.Props;
  defaultTabletop: Tabletops.Props;
  cards: Cards.Props[];
}>("createDeck");
