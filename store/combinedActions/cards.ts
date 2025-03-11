import { createAction } from "@reduxjs/toolkit";
import { Cards, Decks, Tabletops } from "../types";
import { SetCardData } from "./types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.Id;
  cardIds: Cards.Id[];
}>("deleteDeck");

export const updateCard = createAction<{
  cardId: Cards.Id;
  deckId: Decks.Id;
  data: SetCardData;
}>("updateCard");

export interface CreateCardActionPayload {
  cardId: Cards.Id;
  deckId: Decks.Id;
  tabletops: {
    tabletopId: Tabletops.Id;
    cardInstances: Tabletops.CardInstance[];
  }[];
  data: SetCardData;
}

export const createCard = createAction<CreateCardActionPayload>("createCard");

export const deleteCard = createDelayedActionForAnimations<{
  cardId: Cards.Id;
  deckId: Decks.Id | null;
}>("deleteCard");
