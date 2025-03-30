import { createSlice } from "@reduxjs/toolkit";
import { RootState, Cards, SliceName } from "../types";
import { updateCard, createCard, deleteCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import withBuiltInState from "../utils/withBuiltInState";
import { setState, syncState } from "../combinedActions/sync";

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
        dateCreated: actions.payload.date,
        dateUpdated: actions.payload.date,
        size: null,
        status: "active",
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

    builder.addCase(deleteCard.pending, (state, actions) => {
      const card = state.cardsById[actions.meta.arg.cardId];

      if (!card) return;

      card.dateUpdated = actions.meta.arg.date;
      card.status = "deleting";
    });

    builder.addCase(deleteCard.fulfilled, (state, actions) => {
      delete state.cardsById[actions.payload.cardId];
    });

    builder.addCase(deleteDeck.pending, (state, actions) => {
      const cardIds = actions.meta.arg.cardIds;

      cardIds.forEach((cardId) => {
        const card = state.cardsById[cardId];

        if (!card) return;

        card.status = "deleting";
        card.dateUpdated = actions.meta.arg.date;
      });
    });

    builder.addCase(deleteDeck.fulfilled, (state, actions) => {
      const cardIds = actions.payload.cardIds;

      cardIds.forEach((cardId) => {
        delete state.cardsById[cardId];
      });
    });

    builder.addCase(createDeck.pending, (state, actions) => {
      const cards = actions.meta.arg.cards;

      cards.forEach((card) => {
        state.cardsById[card.cardId] = {
          ...card,
          status: "creating",
        };
      });
    });

    builder.addCase(createDeck.fulfilled, (state, actions) => {
      const cards = actions.meta.arg.cards;

      cards.forEach((card) => {
        const existingCard = state.cardsById[card.cardId];

        if (existingCard) {
          existingCard.status = "active";
        } else {
          state.cardsById[card.cardId] = {
            ...card,
            status: "active",
          };
        }
      });
    });

    builder.addCase(setState, (state, actions) => {
      state.cardsById = actions.payload.state[SliceName.Cards].cardsById;
    });

    // builder.addCase(syncState, (state, actions) => {
    //   const { cardsById } = actions.payload.state[SliceName.Cards];

    //   Object.values(cardsById).forEach((card) => {
    //     if (!card) return;

    //     const existingCard = state.cardsById[card.cardId];

    //     if (!existingCard) {
    //       state.cardsById[card.cardId] = {
    //         ...card,
    //         status: "active",
    //       };

    //       return;
    //     }
    //   });
    // });
  },
});

export const selectCard = withBuiltInState(
  (state: RootState, props: { cardId: string }): Card | undefined =>
    state[cardsSlice.name].cardsById[props.cardId],
);

export default cardsSlice;
