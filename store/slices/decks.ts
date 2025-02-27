import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { Decks, RootState, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard, deleteCard, createCard } from "../combinedActions/cards";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import removeFromArray from "@/utils/immer/removeFromArray";
import { CardDataItem } from "../combinedActions/types";

const initialState: Decks.State = flags.USE_DEV_INITIAL_REDUX_STATE
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
    setDeck: (state, actions: PayloadAction<Decks.Props>) => {
      state.decksById[actions.payload.id] = actions.payload;
    },
    removeDeck: (state, actions: PayloadAction<{ cardId: string }>) => {
      delete state.decksById[actions.payload.cardId];
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
    builder.addCase(updateCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);
    });

    builder.addCase(createCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);
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

export const { removeDeck, setDeck, setDeckCardDefaults } = cardsSlice.actions;

export const selectDeck = (
  state: RootState,
  props: { deckId: string },
): Decks.Props | null => state[cardsSlice.name].decksById[props.deckId] ?? null;

export const selectDeckIds = (state: RootState): Decks.DeckId[] =>
  state[cardsSlice.name].deckIds;

export default cardsSlice;
