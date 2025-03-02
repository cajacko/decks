import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCachedSelector } from "re-reselect";
import { WritableDraft } from "immer";
import { configureHistory } from "../history";
import { RootState, Tabletops, SliceName, Cards, Decks } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import { withSeededShuffleSort } from "@/utils/seededShuffle";
import removeFromArray from "@/utils/immer/removeFromArray";
import { deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import withBuiltInState from "../utils/withBuiltInState";

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

    removeFromArray(stack.cardInstances, (item) =>
      cardInstanceIds.includes(item),
    );
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
          toStackId: string;
          newStackDirection: "start" | "end";
          // Do we specify the method, or let the stack define it? Or both? If specified here it's
          // more specific, otherwise do what the stack it's going to says
          method: Tabletops.MoveCardInstanceMethod;
        }>,
      ) => {
        const { cardInstanceId, method, toStackId, newStackDirection } =
          action.payload;
        const toStack = state.stacksById[toStackId];
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

        // It's a new stack, lets add it
        if (!toStack) {
          const newStack: Stack = {
            id: toStackId,
            cardInstances: [cardInstanceId],
          };

          state.stacksById[toStackId] = newStack;

          if (newStackDirection === "start") {
            state.stacksIds.unshift(toStackId);
          } else {
            state.stacksIds.push(toStackId);
          }

          return;
        }

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
    deleteStack: history.withHistory(
      (
        state,
        action: PayloadAction<{ tabletopId: string; stackId: string }>,
      ) => {
        delete state.stacksById[action.payload.stackId];

        removeFromArray(
          state.stacksIds,
          (item) => item === action.payload.stackId,
        );
      },
    ),
    resetTabletop: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          historyState: Tabletops.HistoryState;
        }>,
      ) => {
        state.stacksIds = action.payload.historyState.stacksIds;
        state.stacksById = action.payload.historyState.stacksById;
        state.cardInstancesById = action.payload.historyState.cardInstancesById;
      },
    ),
  },
  extraReducers: (builder) => {
    function deleteCards(
      state: WritableDraft<TabletopState>,
      props: {
        deckId: Decks.DeckId;
        cardIds: Cards.CardId[];
      },
    ) {
      const { deckId, cardIds } = props;

      Object.values(state.tabletopsById).forEach((tabletop) => {
        if (!tabletop) return;
        if (!tabletop.availableDecks?.includes(deckId)) return;

        const present = tabletop.history.present;

        let didEdit = false;

        // NOTE: We may want to do this a different way, perhaps having a separate lookup table that
        // stays in sync?

        const cardInstanceIdsToRemove: string[] = [];

        Object.values(present.cardInstancesById).forEach((cardInstance) => {
          if (!cardInstance) return;
          if (!cardIds.includes(cardInstance.cardId)) return;

          cardInstanceIdsToRemove.push(cardInstance.cardInstanceId);
          delete present.cardInstancesById[cardInstance.cardInstanceId];
          didEdit = true;
        });

        Object.values(present.stacksById).forEach((stack) => {
          if (!stack) return;

          removeFromArray(stack.cardInstances, (item) =>
            cardInstanceIdsToRemove.includes(item),
          );
        });

        // It feels like a bit of a cluster fuck to try and support this after a card is deleted
        if (didEdit) {
          tabletop.history.past = [];
          tabletop.history.future = [];
        }
      });
    }

    builder.addCase(deleteCard.pending, (state, actions) => {
      if (!actions.meta.arg.deckId) return;

      deleteCards(state, {
        deckId: actions.meta.arg.deckId,
        cardIds: [actions.meta.arg.cardId],
      });
    });

    builder.addCase(deleteDeck.pending, (state, actions) => {
      if (actions.meta.arg.tabletopId) {
        delete state.tabletopsById[actions.meta.arg.tabletopId];
      }

      deleteCards(state, {
        deckId: actions.meta.arg.deckId,
        cardIds: actions.meta.arg.cardIds,
      });
    });

    builder.addCase(createDeck.pending, (state, actions) => {
      const tabletop = actions.meta.arg.defaultTabletop;

      state.tabletopsById[tabletop.id] = tabletop;
    });

    builder.addCase(createCard, (state, actions) => {
      actions.payload.tabletops.forEach(({ cardInstances, tabletopId }) => {
        const tabletop = state.tabletopsById[tabletopId];

        if (!tabletop) return;

        const present = tabletop.history.present;

        let didEdit = false;

        cardInstances.forEach((cardInstance) => {
          didEdit = true;

          present.cardInstancesById[cardInstance.cardInstanceId] = cardInstance;

          const stackId = present.stacksIds[0];

          if (!stackId) return;

          const stack = present.stacksById[stackId];

          if (!stack) return;

          stack.cardInstances.push(cardInstance.cardInstanceId);
        });

        // It feels like a bit of a cluster fuck to try and support. As they can then undo a card
        // getting in the tabletop and then have a lost card until they reset. If we add a batter
        // solution we can change this
        if (didEdit) {
          tabletop.history.past = [];
          tabletop.history.future = [];
        }
      });
    });
  },
});

export const {
  changeCardState,
  moveCard,
  setStackOrder,
  undo,
  redo,
  deleteStack,
  resetTabletop,
} = tabletopsSlice.actions;

export const selectTabletop = withBuiltInState(
  (state: RootState, props: { tabletopId: string }): Tabletop | undefined =>
    state[tabletopsSlice.name].tabletopsById[props.tabletopId],
);

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
