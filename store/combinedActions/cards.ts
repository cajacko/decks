import { createAction } from "@reduxjs/toolkit";
import { Cards, Decks } from "../types";
import { CardDataItem } from "./types";

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

export const deleteCard = createAction<{
  cardId: Cards.CardId;
  deckId: Decks.DeckId | null;
}>("deleteCard");
