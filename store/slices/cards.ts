import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// You can safely import the RootState type from the store file here. It's a circular import, but
// the TypeScript compiler can correctly handle that for types. This may be needed for use cases
// like writing selector functions.
// From: https://redux.js.org/tutorials/typescript-quick-start
import type { RootState } from "../store";

// TODO: Where are styles defined, deck, card, both? What happens when a card is in multiple decks?
export interface Card {
  id: string;
}

export interface CardsState {
  cardsById: Record<string, Card | undefined>;
}

// Define the initial state using that type
const initialState: CardsState = {
  cardsById: {
    card1: {
      id: "card1",
    },
    card2: {
      id: "card2",
    },
    card3: {
      id: "card3",
    },
    card4: {
      id: "card4",
    },
    card5: {
      id: "card5",
    },
  },
};

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCard: (state, actions: PayloadAction<Card>) => {
      state.cardsById[actions.payload.id] = actions.payload;
    },
    setCards: (state, actions: PayloadAction<Card[]>) => {
      actions.payload.forEach((card) => {
        state.cardsById[card.id] = card;
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
  props: { cardId: string }
): Card | null => state[cardsSlice.name].cardsById[props.cardId] ?? null;

export default cardsSlice;
