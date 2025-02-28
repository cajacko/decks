import { createAction } from "@reduxjs/toolkit";
import { Cards, Decks, Tabletops } from "../types";
import { CardDataItem } from "./types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.DeckId;
  cardIds: Cards.CardId[];
}>("deleteDeck");

export const updateCard = createAction<{
  cardId: Cards.CardId;
  deckId: Decks.DeckId;
  data: CardDataItem[];
}>("updateCard");

export interface CreateCardActionPayload {
  cardId: Cards.CardId;
  deckId: Decks.DeckId;
  tabletops: {
    tabletopId: Tabletops.TabletopId;
    cardInstances: Tabletops.CardInstance[];
  }[];
  data: CardDataItem[];
}

export const createCard = createAction<CreateCardActionPayload>("createCard");

export const deleteCard = createDelayedActionForAnimations<{
  cardId: Cards.CardId;
  deckId: Decks.DeckId | null;
}>("deleteCard");
