import { Tabletops } from "../types";
import { resetTabletop } from "../slices/tabletop";
import { store } from "../store";
import { selectTabletopAvailableDeckCards } from "../combinedSelectors/tabletops";
import { createInitStacks } from "@/utils/minStacks";
import uuid from "@/utils/uuid";

export function resetTabletopHelper(props: {
  tabletopId: Tabletops.TabletopId;
}) {
  const cardInstanceIds: string[] = [];
  const cardInstancesById: Tabletops.HistoryState["cardInstancesById"] = {};

  const availableDeckCards = selectTabletopAvailableDeckCards(
    store.getState(),
    props,
  );

  availableDeckCards?.forEach(({ cardId, quantity }) => {
    Array.from({ length: quantity }).forEach(() => {
      const cardInstanceId = uuid();

      cardInstanceIds.push(cardInstanceId);

      cardInstancesById[cardInstanceId] = {
        cardId,
        cardInstanceId,
        side: "front",
      };
    });
  });

  const { stacksIds, stacksById } = createInitStacks(cardInstanceIds);

  const historyState: Tabletops.HistoryState = {
    cardInstancesById,
    stacksById,
    stacksIds,
  };

  return resetTabletop({ tabletopId: props.tabletopId, historyState });
}
