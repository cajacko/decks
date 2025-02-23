import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, Cards, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";

export type Card = Cards.Props;

const initialState: Cards.State = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.cards
  : {
      cardsById: {},
    };

export const cardsSlice = createSlice({
  name: SliceName.Cards,
  initialState,
  reducers: {
    setCard: (state, actions: PayloadAction<Card>) => {
      state.cardsById[actions.payload.cardId] = actions.payload;
    },
    setCards: (state, actions: PayloadAction<Card[]>) => {
      actions.payload.forEach((card) => {
        state.cardsById[card.cardId] = card;
      });
    },
    removeCard: (state, actions: PayloadAction<{ cardId: string }>) => {
      // TODO: Remove from decks, stacks, tabletops, etc.
      delete state.cardsById[actions.payload.cardId];
    },
  },
});

export const { setCard, setCards, removeCard } = cardsSlice.actions;

export const selectCard = (
  state: RootState,
  props: { cardId: string },
): Card | null => state[cardsSlice.name].cardsById[props.cardId] ?? null;

export default cardsSlice;
