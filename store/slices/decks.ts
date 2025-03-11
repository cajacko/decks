import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { Cards, Decks, RootState, SliceName } from "../types";
import { getFlag } from "@/utils/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard, deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import removeFromArray from "@/utils/immer/removeFromArray";
import { SetCardData } from "../combinedActions/types";
import withBuiltInState, { getBuiltInState } from "../utils/withBuiltInState";

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
    data: SetCardData;
  },
) {
  const deck = state.decksById[props.deckId];

  function processSide(side: Cards.Side) {
    if (!deck) return;

    const map = props.data.templateMapping[side];
    const templateMapping = deck.templates[side].dataTemplateMapping;

    Object.entries(map).forEach(([dataId, templateDataId]) => {
      if (!templateDataId) return;

      if (templateMapping[dataId]?.templateDataId !== templateDataId) {
        templateMapping[dataId] = {
          dataId,
          templateDataId,
        };
      }

      if (!deck.dataSchemaOrder) {
        deck.dataSchemaOrder = [];
      }

      if (!deck.dataSchemaOrder.includes(dataId)) {
        deck.dataSchemaOrder.push(dataId);
      }

      if (deck.dataSchema[dataId]) return;

      const dataItem = props.data.items.find(
        (item) => item.cardDataId === dataId,
      );

      if (!dataItem) return;
      if (!dataItem.fieldType) return;

      deck.dataSchema[dataId] = {
        id: dataId,
        type: dataItem.fieldType,
      };
    });
  }

  processSide("front");
  processSide("back");
}

export const cardsSlice = createSlice({
  name: SliceName.Decks,
  initialState,
  reducers: {
    setLastScreen: (
      state,
      actions: PayloadAction<{ deckId: Decks.Id; screen: "deck" | "play" }>,
    ) => {
      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.lastScreen = actions.payload.screen;
    },
    setDeckDetails: (
      state,
      actions: PayloadAction<{
        deckId: Decks.Id;
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
        deckId: Decks.Id;
        data: SetCardData;
      }>,
    ) => {
      updateDeckTemplateMapping(state, actions.payload);

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      actions.payload.data.items.forEach((dataItem) => {
        const dataId =
          "cardDataId" in dataItem
            ? dataItem.cardDataId
            : createCardDataSchemaId(dataItem);

        if (dataItem.validatedValue === undefined) {
          delete deck.dataSchema[dataId];
        } else {
          const existingDataSchemaItem = deck.dataSchema[dataId];

          if (existingDataSchemaItem) {
            existingDataSchemaItem.defaultValidatedValue =
              dataItem.validatedValue;

            if (dataItem.fieldType) {
              existingDataSchemaItem.type = dataItem.fieldType;
            }
          } else {
            if (!dataItem.fieldType) return;

            const dataSchemaItem = {
              id: dataId,
              type: dataItem.fieldType,
              defaultValidatedValue: dataItem.validatedValue,
              // This is the best we can get without going a bit cra cra
            } satisfies Decks.CreateDataSchemaItemHelper as Decks.DataSchemaItem;

            deck.dataSchema[dataId] = dataSchemaItem;
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

export const selectDeckIds = (state: RootState): Decks.Id[] =>
  state[cardsSlice.name].deckIds;

export const selectDeckCards = (
  state: RootState,
  props: { deckId: string },
): Decks.Card[] | undefined => selectDeck(state, props)?.cards;

export const selectDeckLastScreen = (
  state: RootState,
  props: { deckId: string },
): "deck" | "play" | undefined => selectDeck(state, props)?.lastScreen;

export const selectBuiltInDeckIds = () => selectDeckIds(getBuiltInState());

export const selectCanEditDeck = (
  state: RootState,
  props: { deckId: string },
): boolean => selectDeck(state, props)?.canEdit ?? false;

export default cardsSlice;
