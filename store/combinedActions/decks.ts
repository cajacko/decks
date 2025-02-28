import { Cards, Decks } from "../types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.DeckId;
  cardIds: Cards.CardId[];
  tabletopId: string | null;
}>("deleteDeck");
