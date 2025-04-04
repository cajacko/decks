import { createAction } from "@reduxjs/toolkit";
import { Cards, DateString, Decks, Tabletops } from "../types";
import { SetCardData } from "./types";

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

export const deleteCard = createAction<{
  cardId: Cards.Id;
  deckId: Decks.Id | null;
  date: DateString;
}>("deleteCard");
