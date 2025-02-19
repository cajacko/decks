import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// You can safely import the RootState type from the store file here. It's a circular import, but
// the TypeScript compiler can correctly handle that for types. This may be needed for use cases
// like writing selector functions.
// From: https://redux.js.org/tutorials/typescript-quick-start
import type { RootState } from "../store";

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  deckCards: DeckCard[];
}

export interface DecksState {
  decksById: Record<string, Deck | undefined>;
}

// Define the initial state using that type
const initialState: DecksState = {
  decksById: {
    deck1: {
      id: "deck1",
      // cardIds: ["card1", "card2", "card3", "card4", "card5"],
      deckCards: [
        {
          cardId: "card1",
          quantity: 1,
        },
        {
          cardId: "card2",
          quantity: 1,
        },
        {
          cardId: "card3",
          quantity: 1,
        },
        {
          cardId: "card4",
          quantity: 1,
        },
        {
          cardId: "card5",
          quantity: 1,
        },
      ],
    },
  },
};

export const cardsSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    // TODO: When cards are deleted we need to go in and update all decks
    setDeck: (state, actions: PayloadAction<Deck>) => {
      state.decksById[actions.payload.id] = actions.payload;
    },
    removeDeck: (state, actions: PayloadAction<{ cardId: string }>) => {
      delete state.decksById[actions.payload.cardId];
    },
  },
});

export const { removeDeck, setDeck } = cardsSlice.actions;

export const selectDeck = (
  state: RootState,
  props: { deckId: string }
): Deck | null => state[cardsSlice.name].decksById[props.deckId] ?? null;

export default cardsSlice;
