import { createAction } from "@reduxjs/toolkit";
import { Cards, Decks } from "../types";
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

export const createCard = createAction<{
  cardId: Cards.CardId;
  deckId: Decks.DeckId;
  data: CardDataItem[];
}>("createCard");

export const deleteCard = createDelayedActionForAnimations<{
  cardId: Cards.CardId;
  deckId: Decks.DeckId | null;
}>("deleteCard");
