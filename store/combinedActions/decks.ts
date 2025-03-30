import { Cards, DateString, Decks, Tabletops } from "../types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.Id;
  cardIds: Cards.Id[];
  tabletopId: Tabletops.Id | null;
  date: DateString;
}>("deleteDeck");

export const createDeck = createDelayedActionForAnimations<{
  deck: Decks.Props;
  defaultTabletop: Tabletops.Props;
  cards: Cards.Props[];
  date: DateString;
}>("createDeck");
