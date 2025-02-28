import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, Cards, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard, createCard, deleteCard } from "../combinedActions/cards";
import { deleteDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";

export type Card = Cards.Props;

export { updateCard };

const initialState: Cards.State = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.cards
  : {
      cardsById: {},
    };

export const cardsSlice = createSlice({
  name: SliceName.Cards,
  initialState,
  reducers: {
    removeCard: (state, actions: PayloadAction<{ cardId: string }>) => {
      // TODO: Remove from decks, stacks, tabletops, etc.
      delete state.cardsById[actions.payload.cardId];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCard, (state, actions) => {
      const card = state.cardsById[actions.payload.cardId];

      if (!card) return;

      actions.payload.data.forEach((dataItem) => {
        const cardDataSchemaId =
          "cardDataId" in dataItem
            ? dataItem.cardDataId
            : createCardDataSchemaId(dataItem);

        if (dataItem.value === null) {
          delete card.data[cardDataSchemaId];
        } else {
          card.data[cardDataSchemaId] = dataItem.value;
        }
      });
    });

    builder.addCase(createCard, (state, actions) => {
      const card: Card = {
        status: "active",
        cardId: actions.payload.cardId,
        deckId: actions.payload.deckId,
        data: {},
      };

      actions.payload.data.forEach((dataItem) => {
        const cardDataSchemaId =
          "cardDataId" in dataItem
            ? dataItem.cardDataId
            : createCardDataSchemaId(dataItem);

        if (dataItem.value !== null) {
          card.data[cardDataSchemaId] = dataItem.value;
        }
      });

      state.cardsById[actions.payload.cardId] = card;
    });

    builder.addCase(deleteCard.pending, (state, actions) => {
      const card = state.cardsById[actions.meta.arg.cardId];

      if (!card) return;

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
      });
    });

    builder.addCase(deleteDeck.fulfilled, (state, actions) => {
      const cardIds = actions.payload.cardIds;

      cardIds.forEach((cardId) => {
        delete state.cardsById[cardId];
      });
    });
  },
});

export const { removeCard } = cardsSlice.actions;

export const selectCard = (
  state: RootState,
  props: { cardId: string },
): Card | null => state[cardsSlice.name].cardsById[props.cardId] ?? null;

export default cardsSlice;
