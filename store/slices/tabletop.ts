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

interface TabletopHistoryState {
  stacksIds: string[];
  stacksById: Record<string, Stack | undefined>;
}

interface TabletopHistory {
  past: TabletopHistoryState[];
  present: TabletopHistoryState;
  future: TabletopHistoryState[];
}

export interface Tabletop {
  id: string;
  stacksIds: string[];
  history: TabletopHistory;
  // availableDecks: string[];
  /**
   * Cards that are not part of the availableDecks but should still be available to the tabletop
   */
  // additionalAvailableCards: string[];
  /**
   * A hand has a stack structure but is not part of the tabletop stacks
   */
  // handStackId: string | null;
  // defines how the tabletop is set up on load or reset, it may just follow the deck setup, or be
  // custom?
  // initSetup: {}
}

export interface TabletopState {
  tabletopsById: Record<string, Tabletop | undefined>;
}

// Define the initial state using that type
const initialState: TabletopState = {
  tabletopsById: {
    tabletop1: {
      id: "tabletop1",
      stacksIds: ["stack1", "stack2", "stack3"],
      // availableDecks: ["deck1"],
      // additionalAvailableCards: [],
      // handStackId: "hand1",
      history: {
        past: [],
        present: {
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
                  state: CardInstanceState.faceUp,
                },
                {
                  cardInstanceId: "cardInstance3",
                  cardId: "card3",
                  state: CardInstanceState.faceUp,
                },
                {
                  cardInstanceId: "cardInstance4",
                  cardId: "card4",
                  state: CardInstanceState.faceUp,
                },
                {
                  cardInstanceId: "cardInstance5",
                  cardId: "card5",
                  state: CardInstanceState.faceUp,
                },
              ],
            },
            stack2: {
              id: "stack2",
              cardInstances: [],
            },
            stack3: {
              id: "stack3",
              cardInstances: [],
            },
          },
          stacksIds: ["stack1", "stack2", "stack3"],
        },
        future: [],
      },
    },
  },
};

export const tabletopsSlice = createSlice({
  name: "tabletops",
  initialState,
  reducers: {
    moveCard: (
      state,
      action: PayloadAction<{
        tabletopId: string;
        cardInstanceId: string;
        fromStackId: string;
        toStackId: string;
        // Do we specify the method, or let the stack define it? Or both? If specified here it's
        // more specific, otherwise do what the stack it's going to says
        method: MoveCardInstanceMethod;
      }>
    ) => {
      const { tabletopId, fromStackId, cardInstanceId, method, toStackId } =
        action.payload;

      const present = state.tabletopsById[tabletopId]?.history.present;

      if (!present) return;

      const fromStack = present?.stacksById[action.payload.fromStackId];
      const toStack = present.stacksById[action.payload.toStackId];

      if (!fromStack || !toStack) return;

      const cardInstance = fromStack.cardInstances.find(
        (cardInstance) =>
          cardInstance.cardInstanceId === action.payload.cardInstanceId
      );

      if (!cardInstance) return;

      // Update the card instance state based on the method
      switch (action.payload.method) {
        case MoveCardInstanceMethod.topFaceUp:
        case MoveCardInstanceMethod.bottomFaceUp:
          cardInstance.state = CardInstanceState.faceUp;
          break;
        case MoveCardInstanceMethod.topFaceDown:
        case MoveCardInstanceMethod.bottomFaceDown:
          cardInstance.state = CardInstanceState.faceDown;
          break;
        case MoveCardInstanceMethod.topNoChange:
        case MoveCardInstanceMethod.bottomNoChange:
        default:
          // Nothing needed here, this is just to remind us that this is on purpose
          break;
      }

      if (fromStack.id === toStack.id) {
        // Moving within the same stack so sort it
        fromStack.cardInstances = fromStack.cardInstances.sort((a, b) => {
          if (a.cardInstanceId === action.payload.cardInstanceId) return 1;
          if (b.cardInstanceId === action.payload.cardInstanceId) return -1;

          return 0;
        });
      } else {
        // Moving stacks so remove it from the old stack
        fromStack.cardInstances = fromStack.cardInstances.filter(
          (cardInstance) =>
            cardInstance.cardInstanceId !== action.payload.cardInstanceId
        );

        // Add to the new stack
        switch (action.payload.method) {
          case MoveCardInstanceMethod.topFaceUp:
          case MoveCardInstanceMethod.topFaceDown:
          case MoveCardInstanceMethod.topNoChange:
            toStack.cardInstances = [cardInstance, ...toStack.cardInstances];
            break;
          case MoveCardInstanceMethod.bottomFaceUp:
          case MoveCardInstanceMethod.bottomFaceDown:
          case MoveCardInstanceMethod.bottomNoChange:
            toStack.cardInstances = [...toStack.cardInstances, cardInstance];
            break;
        }
      }
    },
    changeCardState: (
      state,
      action: PayloadAction<{
        tabletopId: string;
        cardInstanceId: string;
        stackId: string;
        state: CardInstanceState;
      }>
    ) => {
      const present =
        state.tabletopsById[action.payload.tabletopId]?.history.present;
      const stack = present?.stacksById[action.payload.stackId];

      if (!stack) return;

      const cardInstance = stack.cardInstances.find(
        (cardInstance) =>
          cardInstance.cardInstanceId === action.payload.cardInstanceId
      );

      if (!cardInstance) return;

      cardInstance.state = action.payload.state;
    },
    // TODO: reducers shouldn't inject randomness, maybe we can pass in a string/ key to shuffle by?
    // or the action can shuffle it
    shuffleStack: (
      state,
      action: PayloadAction<{
        tabletopId: string;
        stackId: string;
        allCardInstancesState: CardInstanceState | "noChange";
      }>
    ) => {
      const present =
        state.tabletopsById[action.payload.tabletopId]?.history.present;
      const stack = present?.stacksById[action.payload.stackId];

      if (!stack) return;

      const shuffledCardInstances = [...stack.cardInstances].sort(
        () => Math.random() - 0.5
      );

      present.stacksById[action.payload.stackId] = {
        ...stack,
        cardInstances: shuffledCardInstances.map((cardInstance) => ({
          ...cardInstance,
          state:
            action.payload.allCardInstancesState === "noChange"
              ? cardInstance.state
              : action.payload.allCardInstancesState,
        })),
      };
    },
  },
});

export const { changeCardState, moveCard, shuffleStack } =
  tabletopsSlice.actions;

export const selectTabletop = (
  state: RootState,
  props: { tabletopId: string }
): Tabletop | null =>
  state[tabletopsSlice.name].tabletopsById[props.tabletopId] ?? null;

export const selectPresentState = (
  state: RootState,
  props: { tabletopId: string }
): TabletopHistoryState | null =>
  selectTabletop(state, props)?.history.present ?? null;

export const selectStackIds = (
  state: RootState,
  props: { tabletopId: string }
): string[] | null => selectPresentState(state, props)?.stacksIds ?? null;

export const selectStack = (
  state: RootState,
  props: { tabletopId: string; stackId: string }
): Stack | null =>
  selectPresentState(state, props)?.stacksById[props.stackId] ?? null;

export const selectCardInstances = (
  state: RootState,
  props: { stackId: string; tabletopId: string }
): CardInstance[] | null => selectStack(state, props)?.cardInstances ?? null;

// Uses createCachedSelector to select the first 3 cards only from selectCardInstances or null if
// there were none, or whatever we have if there's less than 3
export const selectFirstXCardInstances = createCachedSelector<
  RootState,
  { stackId: string; limit: number; tabletopId: string },
  CardInstance[] | null,
  number,
  CardInstance[] | null
>(
  selectCardInstances,
  (_, props) => props.limit,
  (cardInstances, limit) => {
    const sliced = cardInstances?.slice(0, limit) ?? [];

    if (sliced.length === 0) {
      return null;
    }

    return sliced;
  }
)((state, props) => `${props.stackId}-${props.limit}`);

export default tabletopsSlice;
