import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCachedSelector } from "re-reselect";
// You can safely import the RootState type from the store file here. It's a circular import, but
// the TypeScript compiler can correctly handle that for types. This may be needed for use cases
// like writing selector functions.
// From: https://redux.js.org/tutorials/typescript-quick-start
import type { RootState } from "../store";

export enum MoveCardInstanceMethod {
  topFaceUp = "topFaceUp",
  topFaceDown = "topFaceDown",
  topNoChange = "topNoChange",
  bottomFaceUp = "bottomFaceUp",
  bottomFaceDown = "bottomFaceDown",
  bottomNoChange = "bottomNoChange",
  // Do we want more complex ones like bury/ shuffle in?
}

export enum CardInstanceState {
  faceDown = "faceDown",
  faceUp = "faceUp",
}

export interface CardInstance {
  cardInstanceId: string;
  cardId: string;
  state: CardInstanceState;
}

export interface Stack {
  id: string;
  cardInstances: CardInstance[];
  // defaultCardInstanceState: CardInstanceState | "faceDownTopUp";
  // Do we want these?
  // moveRightTopState: CardInstanceState | null;
  // moveRightBottomState: CardInstanceState | null;
}

export interface StackState {
  stacksById: Record<string, Stack | undefined>;
}

// Define the initial state using that type
const initialState: StackState = {
  stacksById: {
    stack1: {
      id: "stack1",
      cardInstances: [
        {
          cardInstanceId: "cardInstance1",
          cardId: "card1",
          state: CardInstanceState.faceUp,
        },
        {
          cardInstanceId: "cardInstance2",
          cardId: "card2",
          state: CardInstanceState.faceDown,
        },
        {
          cardInstanceId: "cardInstance3",
          cardId: "card3",
          state: CardInstanceState.faceDown,
        },
        {
          cardInstanceId: "cardInstance4",
          cardId: "card4",
          state: CardInstanceState.faceDown,
        },
        {
          cardInstanceId: "cardInstance5",
          cardId: "card5",
          state: CardInstanceState.faceDown,
        },
      ],
    },
    stack2: {
      id: "stack2",
      cardInstances: [],
    },
    hand1: {
      id: "hand1",
      cardInstances: [],
    },
  },
};

export const stacksSlice = createSlice({
  name: "stacks",
  initialState,
  reducers: {
    moveCard: (
      state,
      action: PayloadAction<{
        cardInstanceId: string;
        fromStackId: string;
        toStackId: string;
        // Do we specify the method, or let the stack define it? Or both? If specified here it's
        // more specific, otherwise do what the stack it's going to says
        // method: MoveCardInstanceMethod
      }>
    ) => {},
    changeCardState: (
      state,
      action: PayloadAction<{
        cardInstanceId: string;
        stackId: string;
        state: CardInstanceState;
      }>
    ) => {},
    shuffleStack: (
      state,
      action: PayloadAction<{
        stackId: string;
        allCardInstancesState: CardInstanceState | "noChange";
      }>
    ) => {},
  },
});

// export const { setCard, setCards } = stacksSlice.actions;

export const selectStack = (
  state: RootState,
  props: { stackId: string }
): Stack | null => state[stacksSlice.name].stacksById[props.stackId] ?? null;

export const selectCardInstances = (
  state: RootState,
  props: { stackId: string }
): CardInstance[] | null => selectStack(state, props)?.cardInstances ?? null;

// Uses createCachedSelector to select the first 3 cards only from selectCardInstances or null if
// there were none, or whatever we have if there's less than 3
export const selectVisibleCardInstances = createCachedSelector(
  selectCardInstances,
  (cardInstances) => cardInstances?.slice(0, 3) ?? null
)((state, props) => props.stackId);

export default stacksSlice;
