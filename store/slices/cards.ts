import { createSlice } from "@reduxjs/toolkit";
import { Cards, SliceName } from "../types";
import { updateCard, createCard, deleteCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import {
  setState,
  syncState,
  removeDeletedContent,
} from "../combinedActions/sync";
import { mergeMap } from "../utils/mergeData";
import { removeDeletedDataFromMap } from "../utils/removeDeletedData";

export type Card = Cards.Props;

export { updateCard };

const initialState: Cards.State = {
  cardsById: {},
};

export const cardsSlice = createSlice({
  name: SliceName.Cards,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateCard, (state, actions) => {
      const card = state.cardsById[actions.payload.cardId];

      if (!card) return;

      actions.payload.data.items.forEach((dataItem) => {
        const cardDataSchemaId = dataItem.cardDataId;

        if (dataItem.validatedValue === undefined) {
          delete card.data[cardDataSchemaId];
        } else {
          card.data[cardDataSchemaId] = dataItem.validatedValue;
        }
      });

      card.dateUpdated = actions.payload.date;
    });

    builder.addCase(createCard, (state, actions) => {
      const card: Card = {
        dateDeleted: null,
        dateCreated: actions.payload.date,
        dateUpdated: actions.payload.date,
        size: null,
        canEdit: true,
        cardId: actions.payload.cardId,
        deckId: actions.payload.deckId,
        data: {},
      };

      actions.payload.data.items.forEach((dataItem) => {
        const cardDataSchemaId =
          "cardDataId" in dataItem
            ? dataItem.cardDataId
            : createCardDataSchemaId(dataItem);

        if (dataItem.validatedValue !== undefined) {
          card.data[cardDataSchemaId] = dataItem.validatedValue;
        }
      });

      state.cardsById[actions.payload.cardId] = card;
    });

    builder.addCase(deleteCard, (state, actions) => {
      const card = state.cardsById[actions.payload.cardId];

      if (!card) return;

      card.dateDeleted = actions.payload.date;
      card.dateUpdated = actions.payload.date;
    });

    builder.addCase(deleteDeck, (state, actions) => {
      const cardIds = actions.payload.cardIds;

      cardIds.forEach((cardId) => {
        const card = state.cardsById[cardId];

        if (!card) return;

        card.dateUpdated = actions.payload.date;
        card.dateDeleted = actions.payload.date;
      });
    });

    builder.addCase(createDeck, (state, actions) => {
      const cards = actions.payload.cards;

      cards.forEach((card) => {
        state.cardsById[card.cardId] = card;
      });
    });

    builder.addCase(setState, (state, actions) => {
      state.cardsById = actions.payload.state[SliceName.Cards].cardsById;
    });

    builder.addCase(syncState, (state, actions) => {
      const { cardsById } = actions.payload.state[SliceName.Cards];

      mergeMap(state.cardsById, cardsById, {
        removeAllDeletedBefore: actions.payload.removeAllDeletedBefore,
      });
    });

    builder.addCase(removeDeletedContent, (state, actions) => {
      const removeAllDeletedBefore = actions.payload.removeAllDeletedBefore;

      removeDeletedDataFromMap(state.cardsById, removeAllDeletedBefore);
    });
  },
});

export default cardsSlice;
