import { Cards, DateString, Decks, Tabletops } from "../types";
import { createAction } from "@reduxjs/toolkit";

export const deleteDeck = createAction<{
  deckId: Decks.Id;
  cardIds: Cards.Id[];
  tabletopId: Tabletops.Id | null;
  date: DateString;
}>("deleteDeck");

export const createDeck = createAction<{
  deck: Decks.Props;
  defaultTabletop: Tabletops.Props;
  cards: Cards.Props[];
  date: DateString;
}>("createDeck");
