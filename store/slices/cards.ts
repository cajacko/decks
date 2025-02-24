import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, Cards, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { updateCard } from "../combinedActions/cards";
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
  },
});

export const { removeCard } = cardsSlice.actions;

export const selectCard = (
  state: RootState,
  props: { cardId: string },
): Card | null => state[cardsSlice.name].cardsById[props.cardId] ?? null;

export default cardsSlice;
