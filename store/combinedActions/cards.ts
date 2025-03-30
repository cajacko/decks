import { createAction } from "@reduxjs/toolkit";
import { Cards, DateString, Decks, Tabletops } from "../types";
import { SetCardData } from "./types";
import createDelayedActionForAnimations from "../utils/createDelayedActionForAnimations";

export const deleteDeck = createDelayedActionForAnimations<{
  deckId: Decks.Id;
  cardIds: Cards.Id[];
  date: DateString;
}>("deleteDeck");

export const updateCard = createAction<{
  cardId: Cards.Id;
  deckId: Decks.Id;
  date: DateString;
  data: SetCardData;
}>("updateCard");

export interface CreateCardActionPayload {
  cardId: Cards.Id;
  deckId: Decks.Id;
  date: DateString;
  tabletops: {
    tabletopId: Tabletops.Id;
    cardInstances: Omit<Tabletops.CardInstance, "side">[];
  }[];
  data: SetCardData;
}

export const createCard = createAction<CreateCardActionPayload>("createCard");

export const deleteCard = createDelayedActionForAnimations<{
  cardId: Cards.Id;
  deckId: Decks.Id | null;
  date: DateString;
}>("deleteCard");
