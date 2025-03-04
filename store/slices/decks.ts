import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { Decks, RootState, SliceName } from "../types";
import { getFlag } from "@/utils/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard, deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import removeFromArray from "@/utils/immer/removeFromArray";
import { CardDataItem } from "../combinedActions/types";
import withBuiltInState from "../utils/withBuiltInState";

const initialState: Decks.State = getFlag("USE_DEV_INITIAL_REDUX_STATE", null)
  ? devInitialState.decks
  : {
      decksById: {},
      deckIds: [],
    };

function updateDeckTemplateMapping(
  state: WritableDraft<Decks.State>,
  props: {
    deckId: string;
    data: CardDataItem[];
  },
) {
  const deck = state.decksById[props.deckId];

  if (!deck) return;

  props.data.forEach((dataItem) => {
    if (dataItem.value === null) return;
    if ("cardDataId" in dataItem) return;

    const cardDataSchemaId = createCardDataSchemaId(dataItem);

    const templateMapping = deck.templates[dataItem.side].dataTemplateMapping;

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
      type: dataItem.value?.type,
    };
  });
}

export const cardsSlice = createSlice({
  name: SliceName.Decks,
  initialState,
  reducers: {
    setLastScreen: (
      state,
      actions: PayloadAction<{ deckId: Decks.DeckId; screen: "deck" | "play" }>,
    ) => {
      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.lastScreen = actions.payload.screen;
    },
    setDeckDetails: (
      state,
      actions: PayloadAction<{
        deckId: Decks.DeckId;
        name?: string;
        description?: string;
      }>,
    ) => {
      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      if (actions.payload.name !== undefined) {
        deck.name = actions.payload.name;
      }

      if (actions.payload.description !== undefined) {
        deck.description = actions.payload.description;
      }
    },
    setDeckCardDefaults: (
      state,
      actions: PayloadAction<{
        deckId: Decks.DeckId;
        data: CardDataItem[];
      }>,
    ) => {
      updateDeckTemplateMapping(state, actions.payload);

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      actions.payload.data.forEach((dataItem) => {
        const cardDataSchemaId =
          "cardDataId" in dataItem
            ? dataItem.cardDataId
            : createCardDataSchemaId(dataItem);

        if (dataItem.value === null) {
          delete deck.dataSchema[cardDataSchemaId];
        } else {
          const existingDataSchemaItem = deck.dataSchema[cardDataSchemaId];

          if (existingDataSchemaItem) {
            existingDataSchemaItem.defaultValidatedValue = dataItem.value;
            existingDataSchemaItem.type = dataItem.value.type;
          } else {
            const dataSchemaItem: Decks.LooseDataSchemaItem = {
              id: cardDataSchemaId,
              type: dataItem.value.type,
              defaultValidatedValue: dataItem.value,
            };

            deck.dataSchema[cardDataSchemaId] =
              dataSchemaItem as Decks.DataSchemaItem;
          }
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteDeck.pending, (state, actions) => {
      const deck = state.decksById[actions.meta.arg.deckId];

      if (deck) {
        deck.status = "deleting";
      }

      removeFromArray(state.deckIds, (id) => id === actions.meta.arg.deckId);
    });

    builder.addCase(deleteDeck.fulfilled, (state, actions) => {
      delete state.decksById[actions.payload.deckId];
    });

    builder.addCase(updateCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);
    });

    builder.addCase(createCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.cards.push({
        cardId: actions.payload.cardId,
        quantity: 1,
      });
    });

    builder.addCase(deleteCard.pending, (state, actions) => {
      const deckId = actions.meta.arg.deckId;
      const cardId = actions.meta.arg.cardId;

      if (!deckId) return;

      const deck = state.decksById[deckId];

      if (!deck) return;

      removeFromArray(deck.cards, (item) => item.cardId === cardId);
    });

    builder.addCase(createDeck.pending, (state, actions) => {
      const deckId = actions.meta.arg.deck.id;

      state.decksById[deckId] = actions.meta.arg.deck;
    });

    builder.addCase(createDeck.fulfilled, (state, actions) => {
      const deckId = actions.meta.arg.deck.id;

      state.deckIds.push(deckId);

      const deck = state.decksById[deckId];

      if (deck) {
        deck.status = "active";
      } else {
        state.decksById[deckId] = {
          ...actions.meta.arg.deck,
          status: "active",
        };
      }
    });
  },
});

export const { setDeckCardDefaults, setDeckDetails, setLastScreen } =
  cardsSlice.actions;

export const selectDeck = withBuiltInState(
  (state: RootState, props: { deckId: string }): Decks.Props | undefined =>
    state[cardsSlice.name].decksById[props.deckId],
);

export const selectDeckIds = withBuiltInState(
  (state: RootState): Decks.DeckId[] => state[cardsSlice.name].deckIds,
);

export const selectDeckCards = (
  state: RootState,
  props: { deckId: string },
): Decks.Card[] | undefined => selectDeck(state, props)?.cards;

export const selectDeckLastScreen = (
  state: RootState,
  props: { deckId: string },
): "deck" | "play" | undefined => selectDeck(state, props)?.lastScreen;

export default cardsSlice;
