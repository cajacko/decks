import { Tabletops } from "../types";
import { resetTabletop, selectTabletop, setTabletop } from "../slices/tabletop";
import { store } from "../store";
import { selectTabletopAvailableDeckCards } from "../combinedSelectors/tabletops";
import { createInitStacks } from "@/utils/minStacks";
import uuid from "@/utils/uuid";
import { getBuiltInState } from "../utils/withBuiltInState";

export function resetTabletopHelper(props: { tabletopId: Tabletops.Id }) {
  const builtInTabletop = selectTabletop(getBuiltInState(), props);

  if (builtInTabletop) {
    return setTabletop({
      tabletopId: props.tabletopId,
      tabletop: builtInTabletop,
    });
  }

  const cardInstanceIds: Tabletops.CardInstanceId[] = [];
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
