import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer";
import { configureHistory } from "../history";
import {
  RootState,
  Tabletops,
  SliceName,
  Cards,
  Decks,
  RequiredOperations,
  DateString,
} from "../types";
import { withSeededShuffleSort } from "@/utils/seededShuffle";
import removeFromArray from "@/utils/immer/removeFromArray";
import { deleteCard, createCard } from "../combinedActions/cards";
import { deleteDeck, createDeck } from "../combinedActions/decks";
import { getStackIdForNewCardsAndReset } from "@/utils/minStacks";
import { mergeMap } from "../utils/mergeData";
import {
  setState,
  syncState,
  removeDeletedContent,
} from "../combinedActions/sync";
import { removeDeletedDataFromMap } from "../utils/removeDeletedData";

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

const initialState: TabletopState = {
  tabletopsById: {},
};

type HistoryPayload<P extends object = object> = P & {
  tabletopId: string;
  operation: Tabletops.HistoryOperation | RequiredOperations;
  date: DateString;
};

const history = configureHistory<
  TabletopState,
  TabletopHistoryState,
  { tabletopId: string },
  HistoryPayload
>((state, props) => state.tabletopsById[props.tabletopId]?.history, {
  postAction: (_, action, state) => {
    const tabletop = state.tabletopsById[action.payload.tabletopId];

    if (!tabletop) return;

    tabletop.dateUpdated = action.payload.date;
  },
});

export const { getRedoState, getUndoState, getState } = history;

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

function addCardInstancesToTabletop(
  tabletop: WritableDraft<Tabletop>,
  cardInstances: Omit<Tabletops.CardInstance, "side">[],
  date: DateString,
) {
  const present = tabletop.history.present;

  const stackId = getStackIdForNewCardsAndReset(
    present.stacksIds,
    tabletop.settings,
  );

  // We have no where to add them! Shouldn't happen
  if (!stackId) return;

  const stack = present.stacksById[stackId];

  if (!stack) return;

  let didEdit = false;

  cardInstances.forEach((cardInstance) => {
    didEdit = true;

    present.cardInstancesById[cardInstance.cardInstanceId] = {
      ...cardInstance,
      side: tabletop.settings?.defaultCardSide ?? "front",
    };

    if (tabletop.settings?.newCardsGoToTopOfStack) {
      stack.cardInstances.unshift(cardInstance.cardInstanceId);
    } else {
      stack.cardInstances.push(cardInstance.cardInstanceId);
    }
  });

  // It feels like a bit of a cluster fuck to try and support. As they can then undo a card
  // getting in the tabletop and then have a lost card until they reset. If we add a batter
  // solution we can change this
  if (didEdit) {
    tabletop.history.past = [];
    tabletop.history.future = [];
    tabletop.dateUpdated = date;
  }
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
        action: PayloadAction<
          HistoryPayload<{
            moveTarget: { cardInstanceId: string } | { stackId: string | null };
            toTarget: { stackId: string; newStackDirection?: "start" | "end" };
            // Do we specify the method, or let the stack define it? Or both? If specified here it's
            // more specific, otherwise do what the stack it's going to says
            method: MoveCardInstanceMethod;
          }>
        >,
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
        action: PayloadAction<
          HistoryPayload<{
            side: Cards.Side;
            target: { cardInstanceId: string } | { stackId: string | null };
          }>
        >,
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
        action: PayloadAction<
          HistoryPayload<{
            stackId: string | null;
            method: { type: "shuffle"; seed: string } | { type: "reverse" };
            allCardInstancesState: Cards.Side | "noChange";
          }>
        >,
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
      (state, action: PayloadAction<HistoryPayload<{ stackId: string }>>) => {
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
        action: PayloadAction<
          HistoryPayload<{
            historyState: Tabletops.HistoryState;
          }>
        >,
      ) => {
        state.stacksIds = action.payload.historyState.stacksIds;
        state.stacksById = action.payload.historyState.stacksById;
        state.cardInstancesById = action.payload.historyState.cardInstancesById;
      },
    ),
    addMissingTabletopCards: (
      state,
      action: PayloadAction<{
        tabletopId: string;
        cardInstances: Omit<Tabletops.CardInstance, "side">[];
        date: DateString;
      }>,
    ) => {
      const tabletop = state.tabletopsById[action.payload.tabletopId];

      if (!tabletop) return;

      tabletop.dateUpdated = action.payload.date;
      tabletop.missingCardIds = [];

      addCardInstancesToTabletop(
        tabletop,
        action.payload.cardInstances,
        action.payload.date,
      );
    },
    setTabletopSetting: <K extends keyof Tabletops.Settings>(
      state: WritableDraft<TabletopState>,
      action: PayloadAction<{
        tabletopId: string;
        key: K;
        value: Tabletops.Settings[K];
        date: DateString;
      }>,
    ) => {
      const tabletop = state.tabletopsById[action.payload.tabletopId];

      if (!tabletop) return;

      tabletop.dateUpdated = action.payload.date;

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
        date: DateString;
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
          tabletop.dateUpdated = props.date;
        }
      });
    }

    builder.addCase(deleteCard, (state, actions) => {
      if (!actions.payload.deckId) return;

      deleteCards(state, {
        deckId: actions.payload.deckId,
        cardIds: [actions.payload.cardId],
        date: actions.payload.date,
      });
    });

    builder.addCase(deleteDeck, (state, actions) => {
      if (actions.payload.tabletopId) {
        const tabletop = state.tabletopsById[actions.payload.tabletopId];

        if (tabletop) {
          tabletop.dateDeleted = actions.payload.date;
          tabletop.dateUpdated = actions.payload.date;
        }
      }

      deleteCards(state, {
        deckId: actions.payload.deckId,
        cardIds: actions.payload.cardIds,
        date: actions.payload.date,
      });
    });

    builder.addCase(createDeck, (state, actions) => {
      const tabletop = actions.payload.defaultTabletop;

      state.tabletopsById[tabletop.id] = tabletop;
    });

    builder.addCase(createCard, (state, actions) => {
      actions.payload.tabletops.forEach(({ cardInstances, tabletopId }) => {
        const tabletop = state.tabletopsById[tabletopId];

        if (!tabletop) return;

        if (tabletop.settings?.doNotAddNewCardsAutomatically) {
          if (!tabletop.missingCardIds) {
            tabletop.missingCardIds = [];
          }

          tabletop.dateUpdated = actions.payload.date;
          tabletop.missingCardIds.push(actions.payload.cardId);

          return;
        }

        addCardInstancesToTabletop(
          tabletop,
          cardInstances,
          actions.payload.date,
        );
      });
    });

    builder.addCase(setState, (state, actions) => {
      state.tabletopsById =
        actions.payload.state[SliceName.Tabletops].tabletopsById;
    });

    builder.addCase(syncState, (state, actions) => {
      mergeMap(
        state.tabletopsById,
        actions.payload.state.tabletops.tabletopsById,
        {
          removeAllDeletedBefore: actions.payload.removeAllDeletedBefore,
        },
      );
    });

    builder.addCase(removeDeletedContent, (state, actions) => {
      removeDeletedDataFromMap(
        state.tabletopsById,
        actions.payload.removeAllDeletedBefore,
      );
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
  addMissingTabletopCards,
} = tabletopsSlice.actions;

const historySelectors = history.withSelectors<RootState>(
  (state) => state.tabletops,
);

export const selectTabletopHasPast = historySelectors.selectHasPast;
export const selectTabletopHasFuture = historySelectors.selectHasFuture;

export default tabletopsSlice;
