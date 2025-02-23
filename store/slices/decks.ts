import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Decks, RootState, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";

const initialState: Decks.State = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.decks
  : {
      decksById: {},
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
});

export const { removeDeck, setDeck } = cardsSlice.actions;

export const selectDeck = (
  state: RootState,
  props: { deckId: string },
): Decks.Props | null => state[cardsSlice.name].decksById[props.deckId] ?? null;

export default cardsSlice;
