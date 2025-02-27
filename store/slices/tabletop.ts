import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCachedSelector } from "re-reselect";
import { WritableDraft } from "immer";
import { configureHistory } from "../history";
import { RootState, Tabletops, SliceName, Cards } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { withSeededShuffleSort } from "@/utils/seededShuffle";

export type TabletopState = Tabletops.State;
export type Tabletop = Tabletops.Props;
export type TabletopHistoryState = Tabletops.HistoryState;
export type Stack = Tabletops.Stack;
export type CardInstance = Tabletops.CardInstance;

export const MoveCardInstanceMethod = Tabletops.MoveCardInstanceMethod;

const initialState: TabletopState = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.tabletops
  : {
      tabletopsById: {},
    };

const history = configureHistory<
  TabletopState,
  TabletopHistoryState,
  { tabletopId: string }
>((state, props) => state.tabletopsById[props.tabletopId]?.history);

// This helper is great for ensuring we don't have duplicate card instance IDs in stacks (which we
// had once). But also ensures we don't mutate arrays that don't ned changing.
function removeCardInstancesFromStacks(
  state:
    | WritableDraft<TabletopHistoryState>
    | WritableDraft<WritableDraft<TabletopHistoryState>>,
  cardInstanceIds: string[],
) {
  Object.values(state.stacksById).forEach((stack) => {
    if (!stack) return;

    // Don't use filter as this would create new arrays even if the item doesn't exist in this stack
    // Loop backwards to safely remove items while iterating
    for (let i = stack.cardInstances.length - 1; i >= 0; i--) {
      if (cardInstanceIds.includes(stack.cardInstances[i])) {
        stack.cardInstances.splice(i, 1); // Remove the card instance
      }
    }
  });
}

export const tabletopsSlice = createSlice({
  name: SliceName.Tabletops,
  initialState,
  reducers: {
    undo: history.undo,
    redo: history.redo,
    moveCard: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          cardInstanceId: string;
          fromStackId: string;
          toStackId: string;
          // Do we specify the method, or let the stack define it? Or both? If specified here it's
          // more specific, otherwise do what the stack it's going to says
          method: Tabletops.MoveCardInstanceMethod;
        }>,
      ) => {
        const { fromStackId, cardInstanceId, method, toStackId } =
          action.payload;

        const fromStack = state?.stacksById[fromStackId];
        const toStack = state.stacksById[toStackId];

        if (!fromStack || !toStack) return;

        const cardInstance = state.cardInstancesById[cardInstanceId];

        if (!cardInstance) return;

        // Update the card instance state based on the method
        switch (method) {
          case MoveCardInstanceMethod.topFaceUp:
          case MoveCardInstanceMethod.bottomFaceUp: {
            if (cardInstance.side !== "front") {
              cardInstance.side = "front";
            }
            break;
          }
          case MoveCardInstanceMethod.topFaceDown:
          case MoveCardInstanceMethod.bottomFaceDown: {
            if (cardInstance.side !== "back") {
              cardInstance.side = "back";
            }
            break;
          }
          case MoveCardInstanceMethod.topNoChange:
          case MoveCardInstanceMethod.bottomNoChange:
          default:
            // Nothing needed here, this is just to remind us that this is on purpose
            break;
        }

        // Helps prevent duplicates if the action has got confused somehow
        removeCardInstancesFromStacks(state, [cardInstanceId]);

        // Add to the new stack
        switch (method) {
          case MoveCardInstanceMethod.topFaceUp:
          case MoveCardInstanceMethod.topFaceDown:
          case MoveCardInstanceMethod.topNoChange: {
            toStack.cardInstances.unshift(cardInstanceId);
            break;
          }
          case MoveCardInstanceMethod.bottomFaceUp:
          case MoveCardInstanceMethod.bottomFaceDown:
          case MoveCardInstanceMethod.bottomNoChange: {
            toStack.cardInstances.push(cardInstanceId);
            break;
          }
        }
      },
    ),
    changeCardState: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          cardInstanceId: string;
          side: Cards.Side;
        }>,
      ) => {
        const cardInstance =
          state.cardInstancesById[action.payload.cardInstanceId];

        if (!cardInstance) return;

        cardInstance.side = action.payload.side;
      },
    ),
    setStackOrder: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          stackId: string;
          seed: number | string;
          allCardInstancesState: Cards.Side | "noChange";
        }>,
      ) => {
        const stack = state?.stacksById[action.payload.stackId];

        if (!stack) return;

        const allCardInstancesState = action.payload.allCardInstancesState;

        if (allCardInstancesState !== "noChange") {
          stack.cardInstances.forEach((cardInstanceId) => {
            const cardInstance = state.cardInstancesById[cardInstanceId];

            if (!cardInstance) return;
            if (cardInstance.side === allCardInstancesState) return;

            cardInstance.side = allCardInstancesState;
          });
        }

        stack.cardInstances.sort(withSeededShuffleSort(action.payload.seed));
      },
    ),
  },
});

export const { changeCardState, moveCard, setStackOrder, undo, redo } =
  tabletopsSlice.actions;

export const selectTabletop = (
  state: RootState,
  props: { tabletopId: string },
): Tabletop | null =>
  state[tabletopsSlice.name].tabletopsById[props.tabletopId] ?? null;

export const selectPresentState = (
  state: RootState,
  props: { tabletopId: string },
): TabletopHistoryState | null =>
  selectTabletop(state, props)?.history.present ?? null;

export const selectStackIds = (
  state: RootState,
  props: { tabletopId: string },
): string[] | null => selectPresentState(state, props)?.stacksIds ?? null;

export const selectStack = (
  state: RootState,
  props: { tabletopId: string; stackId: string },
): Stack | null =>
  selectPresentState(state, props)?.stacksById[props.stackId] ?? null;

export const selectCardInstanceIds = (
  state: RootState,
  props: { stackId: string; tabletopId: string },
): string[] | null => selectStack(state, props)?.cardInstances ?? null;

export const selectCardInstance = (
  state: RootState,
  props: { cardInstanceId: string; tabletopId: string },
): CardInstance | null =>
  selectPresentState(state, props)?.cardInstancesById?.[props.cardInstanceId] ??
  null;

const historySelectors = history.withSelectors<RootState>(
  (state) => state.tabletops,
);

export const selectTabletopHasPast = historySelectors.selectHasPast;
export const selectTabletopHasFuture = historySelectors.selectHasFuture;

// Uses createCachedSelector to select the first 3 cards only from selectCardInstances or null if
// there were none, or whatever we have if there's less than 3
export const selectFirstXCardInstances = createCachedSelector<
  RootState,
  { stackId: string; limit: number; tabletopId: string },
  string[] | null,
  number,
  string[] | null
>(
  selectCardInstanceIds,
  (_, props) => props.limit,
  (cardInstances, limit) => {
    const sliced = cardInstances?.slice(0, limit) ?? [];

    if (sliced.length === 0) {
      return null;
    }

    return sliced;
  },
)((_, props) => `${props.stackId}-${props.limit}`);

export default tabletopsSlice;
