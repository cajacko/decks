import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Decks, RootState, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard, deleteCard } from "../combinedActions/cards";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import removeFromArray from "@/utils/immer/removeFromArray";

const initialState: Decks.State = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.decks
  : {
      decksById: {},
      deckIds: [],
    };

export const cardsSlice = createSlice({
  name: SliceName.Decks,
  initialState,
  reducers: {
    // TODO: When cards are deleted we need to go in and update all decks
    setDeck: (state, actions: PayloadAction<Decks.Props>) => {
      state.decksById[actions.payload.id] = actions.payload;
    },
    removeDeck: (state, actions: PayloadAction<{ cardId: string }>) => {
      delete state.decksById[actions.payload.cardId];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCard, (state, actions) => {
      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      actions.payload.data.forEach((dataItem) => {
        if (dataItem.value === null) return;
        if ("cardDataId" in dataItem) return;

        const cardDataSchemaId = createCardDataSchemaId(dataItem);

        const templateMapping =
          deck.templates[dataItem.side].dataTemplateMapping;

        if (!templateMapping[dataItem.templateDataItemId]) {
          templateMapping[dataItem.templateDataItemId] = {
            dataSchemaItemId: cardDataSchemaId,
            templateSchemaItemId: dataItem.templateDataItemId,
          };
        }

        if (!deck.dataSchemaOrder.includes(cardDataSchemaId)) {
          deck.dataSchemaOrder.push(cardDataSchemaId);
        }

        if (deck.dataSchema[cardDataSchemaId]) return;

        deck.dataSchema[cardDataSchemaId] = {
          id: cardDataSchemaId,
          title: dataItem.templateDataItemTitle,
          type: dataItem.value?.type,
        };
      });
    });

    builder.addCase(deleteCard, (state, actions) => {
      if (!actions.payload.deckId) return;

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      removeFromArray(
        deck.cards,
        (item) => item.cardId === actions.payload.cardId,
      );
    });
  },
});

export const { removeDeck, setDeck } = cardsSlice.actions;

export const selectDeck = (
  state: RootState,
  props: { deckId: string },
): Decks.Props | null => state[cardsSlice.name].decksById[props.deckId] ?? null;

export const selectDeckIds = (state: RootState): Decks.DeckId[] =>
  state[cardsSlice.name].deckIds;

export default cardsSlice;
