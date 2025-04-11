import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { Cards, DateString, Decks, SliceName } from "../types";
import { updateCard, deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import createCardDataSchemaId from "../utils/createCardDataSchemaId";
import removeFromArray from "@/utils/immer/removeFromArray";
import { SetCardData } from "../combinedActions/types";
import AppError from "@/classes/AppError";
import { mergeMap } from "../utils/mergeData";
import {
  setState,
  syncState,
  removeDeletedContent,
} from "../combinedActions/sync";
import { removeDeletedDataFromMap } from "../utils/removeDeletedData";

const initialState: Decks.State = {
  decksById: {},
};

function updateDeckTemplateMapping(
  state: WritableDraft<Decks.State>,
  props: {
    deckId: string;
    data: SetCardData;
    date: DateString;
  },
) {
  const deck = state.decksById[props.deckId];

  let hasUpdated = false;

  function processSide(side: Cards.Side) {
    if (!deck) return;

    const map = props.data.templateMapping[side];
    const templateMapping = deck.templates[side].dataTemplateMapping;

    Object.entries(map).forEach(([templateDataId, dataId]) => {
      if (!dataId) return;

      if (templateMapping[templateDataId]?.templateDataId !== templateDataId) {
        hasUpdated = true;

        templateMapping[templateDataId] = {
          dataId,
          templateDataId,
        };
      }

      if (!deck.dataSchemaOrder) {
        hasUpdated = true;
        deck.dataSchemaOrder = [];
      }

      if (!deck.dataSchemaOrder.includes(dataId)) {
        hasUpdated = true;
        deck.dataSchemaOrder.push(dataId);
      }

      if (deck.dataSchema[dataId]) return;

      const dataItem = props.data.items.find(
        (item) => item.cardDataId === dataId,
      );

      if (!dataItem) return;
      if (!dataItem.fieldType) return;

      hasUpdated = true;
      deck.dataSchema[dataId] = {
        id: dataId,
        type: dataItem.fieldType,
      };
    });
  }

  processSide("front");
  processSide("back");

  if (hasUpdated && deck) {
    deck.dateUpdated = props.date;
  }
}

export const cardsSlice = createSlice({
  name: SliceName.Decks,
  initialState,
  reducers: {
    setLastScreen: (
      state,
      actions: PayloadAction<{ deckId: Decks.Id; screen: "deck" | "play" }>,
    ) => {
      // NOTE: Do not update dateUpdated from this, it's just a minor ux thing not a data thing that
      // should mess up our date syncing
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
        date: DateString;
      }>,
    ) => {
      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.dateUpdated = actions.payload.date;

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
        date: DateString;
      }>,
    ) => {
      updateDeckTemplateMapping(state, actions.payload);

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.dateUpdated = actions.payload.date;

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
            if (!dataItem.fieldType) {
              new AppError(
                `setDeckCardDefaults - decks slice could not add a new deck default. No fieldType was given`,
                dataItem,
              ).log("error");

              return;
            }

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
    builder.addCase(deleteDeck, (state, actions) => {
      const deck = state.decksById[actions.payload.deckId];

      if (deck) {
        deck.dateUpdated = actions.payload.date;
        deck.dateDeleted = actions.payload.date;
      }
    });

    builder.addCase(updateCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);
    });

    builder.addCase(createCard, (state, actions) => {
      updateDeckTemplateMapping(state, actions.payload);

      const deck = state.decksById[actions.payload.deckId];

      if (!deck) return;

      deck.dateUpdated = actions.payload.date;

      deck.cards.push({
        cardId: actions.payload.cardId,
        quantity: 1,
      });
    });

    builder.addCase(deleteCard, (state, actions) => {
      const deckId = actions.payload.deckId;
      const cardId = actions.payload.cardId;

      if (!deckId) return;

      const deck = state.decksById[deckId];

      if (!deck) return;

      deck.dateUpdated = actions.payload.date;

      removeFromArray(deck.cards, (item) => item.cardId === cardId);
    });

    builder.addCase(createDeck, (state, actions) => {
      const deckId = actions.payload.deck.id;

      state.decksById[deckId] = actions.payload.deck;
    });

    builder.addCase(setState, (state, actions) => {
      state.decksById = actions.payload.state[SliceName.Decks].decksById;
    });

    builder.addCase(syncState, (state, actions) => {
      mergeMap(
        state.decksById,
        actions.payload.state[SliceName.Decks].decksById,
        {
          removeAllDeletedBefore: actions.payload.removeAllDeletedBefore,
        },
      );
    });

    builder.addCase(removeDeletedContent, (state, actions) => {
      const removeAllDeletedBefore = actions.payload.removeAllDeletedBefore;

      removeDeletedDataFromMap(state.decksById, removeAllDeletedBefore);
    });
  },
});

export const { setDeckCardDefaults, setDeckDetails, setLastScreen } =
  cardsSlice.actions;

export default cardsSlice;
