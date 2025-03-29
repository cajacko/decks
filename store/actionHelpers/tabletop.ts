import { Decks, Tabletops } from "../types";
import {
  resetTabletop,
  selectTabletop,
  setTabletop,
  addMissingTabletopCards,
} from "../slices/tabletop";
import { store } from "../store";
import {
  selectTabletopAvailableDeckCards,
  selectTabletopSettings,
} from "../combinedSelectors/tabletops";
import { createInitStacks } from "@/utils/minStacks";
import uuid from "@/utils/uuid";
import { getBuiltInState } from "../utils/withBuiltInState";

function deckCardsToCardInstances(
  deckCards: Decks.Card[] | null,
  settings: Tabletops.Settings | null,
): Tabletops.CardInstance[] {
  const cardInstances: Tabletops.CardInstance[] = [];

  deckCards?.forEach(({ cardId, quantity }) => {
    Array.from({ length: quantity }).forEach(() => {
      const cardInstanceId = uuid();

      cardInstances.push({
        cardId,
        cardInstanceId,
        side: settings?.defaultCardSide ?? "front",
      });
    });
  });

  return cardInstances;
}

export function getResetHistoryState(
  availableDeckCards: Decks.Card[] | null,
  settings: Tabletops.Settings | null,
): Tabletops.HistoryState {
  const cardInstanceIds: Tabletops.CardInstanceId[] = [];
  const cardInstancesById: Tabletops.HistoryState["cardInstancesById"] = {};

  deckCardsToCardInstances(availableDeckCards, settings).forEach(
    (cardInstance) => {
      cardInstanceIds.push(cardInstance.cardInstanceId);

      cardInstancesById[cardInstance.cardInstanceId] = cardInstance;
    },
  );

  const { stacksIds, stacksById } = createInitStacks(cardInstanceIds, settings);

  return {
    operation: { type: "RESET", payload: null },
    cardInstancesById,
    stacksById,
    stacksIds,
  };
}

export function resetTabletopHelper(props: { tabletopId: Tabletops.Id }) {
  // This gets the user settings for the tabletop (if they exist)
  const tableTopSettings = selectTabletopSettings(store.getState(), props);
  const builtInTabletop = selectTabletop(getBuiltInState(), props);

  if (builtInTabletop) {
    return setTabletop({
      tabletopId: props.tabletopId,
      tabletop: {
        ...builtInTabletop,
        id: props.tabletopId,
        // Override with any user defined settings
        settings: {
          ...builtInTabletop.settings,
          ...tableTopSettings,
        },
      },
    });
  }

  const availableDeckCards = selectTabletopAvailableDeckCards(
    store.getState(),
    props,
  );

  return resetTabletop({
    tabletopId: props.tabletopId,
    operation: { type: "RESET", payload: null },
    historyState: getResetHistoryState(
      availableDeckCards,
      tableTopSettings ?? null,
    ),
  });
}

export function addMissingTabletopCardsHelper(props: {
  tabletopId: Tabletops.Id;
}) {
  const missingCardIds =
    selectTabletop(store.getState(), props)?.missingCardIds ?? [];
  const tabletopSettings = selectTabletopSettings(store.getState(), props);

  const availableDeckCards = (
    selectTabletopAvailableDeckCards(store.getState(), props) ?? []
  ).filter(({ cardId }) => missingCardIds.includes(cardId));

  const cardInstances = deckCardsToCardInstances(
    availableDeckCards,
    tabletopSettings ?? null,
  );

  return addMissingTabletopCards({
    tabletopId: props.tabletopId,
    cardInstances,
  });
}
