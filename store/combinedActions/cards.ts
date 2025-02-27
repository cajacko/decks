import { createAction } from "@reduxjs/toolkit";
import { Cards, Decks, Templates } from "../types";
import { CreateCardDataSchemaProps } from "../utils/createCardDataSchemaId";

export type CardDataItem =
  | {
      cardDataId: string;
      value: Templates.ValidatedValue | null;
    }
  | (CreateCardDataSchemaProps & {
      value: Templates.ValidatedValue | null;
      templateDataItemTitle: string;
    });

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
