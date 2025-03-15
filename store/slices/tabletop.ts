import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createCachedSelector } from "re-reselect";
import { WritableDraft } from "immer";
import { configureHistory } from "../history";
import { RootState, Tabletops, SliceName, Cards, Decks } from "../types";
import { getFlag } from "@/utils/flags";
import devInitialState from "../dev/devInitialState";
import { withSeededShuffleSort } from "@/utils/seededShuffle";
import removeFromArray from "@/utils/immer/removeFromArray";
import { deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";

export type TabletopState = Tabletops.State;
export type Tabletop = Tabletops.Props;
export type TabletopHistoryState = Tabletops.HistoryState;
export type Stack = Tabletops.Stack;
export type CardInstance = Tabletops.CardInstance;

export enum MoveCardInstanceMethod {
  topFaceUp = "topFaceUp",
  topFaceDown = "topFaceDown",
  topNoChange = "topNoChange",
  bottomFaceUp = "bottomFaceUp",
  bottomFaceDown = "bottomFaceDown",
  bottomNoChange = "bottomNoChange",
}

const initialState: TabletopState = getFlag("USE_DEV_INITIAL_REDUX_STATE", null)
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
    setTabletop: (
      state,
      action: PayloadAction<{
        tabletopId: string;
        tabletop: Tabletop;
      }>,
    ) => {
      state.tabletopsById[action.payload.tabletopId] = action.payload.tabletop;
    },
    moveCard: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          moveTarget: { cardInstanceId: string } | { stackId: string | null };
          toTarget: { stackId: string; newStackDirection?: "start" | "end" };
          // Do we specify the method, or let the stack define it? Or both? If specified here it's
          // more specific, otherwise do what the stack it's going to says
          method: MoveCardInstanceMethod;
        }>,
      ) => {
        const {
          moveTarget,
          method,
          toTarget: { stackId: toStackId, newStackDirection },
        } = action.payload;

        // Create our new stack (empty for now) then we can follow the rest of the logic
        if (newStackDirection) {
          const newStack: Stack = {
            id: toStackId,
            cardInstances: [],
          };

          state.stacksById[toStackId] = newStack;

          if (newStackDirection === "start") {
            state.stacksIds.unshift(toStackId);
          } else {
            state.stacksIds.push(toStackId);
          }
        }

        const toStack = state.stacksById[toStackId];

        if (!toStack) return;

        let cardInstanceIdsToAdd: string[] = [];

        function clearStackAndAddCardInstancesToMove(stackId: string) {
          // Don't touch the cards in the stack we're moving to
          if (stackId === toStackId) return;

          const fromStack = state.stacksById[stackId];

          if (!fromStack) return;

          cardInstanceIdsToAdd.push(...fromStack.cardInstances);
          fromStack.cardInstances = [];
        }

        if ("cardInstanceId" in moveTarget) {
          cardInstanceIdsToAdd = [moveTarget.cardInstanceId];
          removeCardInstancesFromStacks(state, cardInstanceIdsToAdd);
        } else if (moveTarget.stackId) {
          clearStackAndAddCardInstancesToMove(moveTarget.stackId);
        } else {
          // Move all the cards from all stacks. clearStackAndAddCardInstancesToMove will skip the
          // target move to stack, so we can just run this on all
          state.stacksIds.forEach(clearStackAndAddCardInstancesToMove);
        }

        // There are no cards to move, so we don't have to do anything else
        if (cardInstanceIdsToAdd.length <= 0) return;

        // Helps prevent duplicates if the action has got confused somehow
        removeCardInstancesFromStacks(state, cardInstanceIdsToAdd);

        // NOTE: At this point we have removed the target cardInstance ID's from all stacks. So
        // we're in a clean state to add them

        cardInstanceIdsToAdd.forEach((cardInstanceId) => {
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
        });

        // Add to the new stack
        switch (method) {
          case MoveCardInstanceMethod.topFaceUp:
          case MoveCardInstanceMethod.topFaceDown:
          case MoveCardInstanceMethod.topNoChange: {
            toStack.cardInstances.unshift(...cardInstanceIdsToAdd);
            break;
          }
          case MoveCardInstanceMethod.bottomFaceUp:
          case MoveCardInstanceMethod.bottomFaceDown:
          case MoveCardInstanceMethod.bottomNoChange: {
            toStack.cardInstances.push(...cardInstanceIdsToAdd);
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
          side: Cards.Side;
          target: { cardInstanceId: string } | { stackId: string | null };
        }>,
      ) => {
        const target = action.payload.target;

        function changeCardState(cardInstanceId: string) {
          const cardInstance = state.cardInstancesById[cardInstanceId];

          if (!cardInstance) return;

          cardInstance.side = action.payload.side;
        }

        if ("cardInstanceId" in target) {
          changeCardState(target.cardInstanceId);
        } else {
          Object.entries(state.stacksById).forEach(([stackId, stack]) => {
            if (!stack) return;
            if (target.stackId && stackId !== target.stackId) {
              return;
            }

            stack.cardInstances.forEach(changeCardState);
          });
        }
      },
    ),
    setStackOrder: history.withHistory(
      (
        state,
        action: PayloadAction<{
          tabletopId: string;
          stackId: string | null;
          method: { type: "shuffle"; seed: string } | { type: "reverse" };
          allCardInstancesState: Cards.Side | "noChange";
        }>,
      ) => {
        const method = action.payload.method;

        Object.entries(state.stacksById).forEach(([stackId, stack]) => {
          if (!stack) return;
          if (action.payload.stackId && stackId !== action.payload.stackId) {
            return;
          }

          const allCardInstancesState = action.payload.allCardInstancesState;

          if (allCardInstancesState !== "noChange") {
            stack.cardInstances.forEach((cardInstanceId) => {
              const cardInstance = state.cardInstancesById[cardInstanceId];

              if (!cardInstance) return;
              if (cardInstance.side === allCardInstancesState) return;

              cardInstance.side = allCardInstancesState;
            });
          }

          switch (method.type) {
            case "shuffle": {
              stack.cardInstances.sort(
                // This ensures we don't do the same sort operation for stacks of the same length,
                // because we passed only 1 seed
                withSeededShuffleSort(method.seed + stackId),
              );
              break;
            }
            case "reverse": {
              stack.cardInstances.reverse();
              break;
            }
          }
        });
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
    setTabletopSetting: <K extends keyof Tabletops.Settings>(
      state: WritableDraft<TabletopState>,
      action: PayloadAction<{
        tabletopId: string;
        key: K;
        value: Tabletops.Settings[K];
      }>,
    ) => {
      const tabletop = state.tabletopsById[action.payload.tabletopId];

      if (!tabletop) return;

      if (!tabletop.settings) {
        tabletop.settings = {};
      }

      tabletop.settings[action.payload.key] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    function deleteCards(
      state: WritableDraft<TabletopState>,
      props: {
        deckId: Decks.Id;
        cardIds: Cards.Id[];
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
  setTabletop,
  setTabletopSetting,
} = tabletopsSlice.actions;

export const selectTabletop = (
  state: RootState,
  props: { tabletopId: string },
): Tabletop | undefined =>
  state[tabletopsSlice.name].tabletopsById[props.tabletopId];

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

export const selectDoesTabletopHaveCardInstances = createCachedSelector(
  selectPresentState,
  (presentState): boolean => {
    if (!presentState) {
      return false;
    }

    for (const stackId of presentState.stacksIds) {
      const stack = presentState.stacksById[stackId];

      if (!stack) continue;

      for (const cardInstanceId of stack.cardInstances) {
        if (presentState.cardInstancesById[cardInstanceId]) {
          return true;
        }
      }
    }

    return false;
  },
)((_, props: { tabletopId: string }) => props.tabletopId);

export const selectTabletopSettings = (
  state: RootState,
  props: { tabletopId: string },
): Tabletops.Settings | undefined => selectTabletop(state, props)?.settings;

export default tabletopsSlice;
