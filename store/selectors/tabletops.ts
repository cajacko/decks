import { createCachedSelector } from "re-reselect";
import { RootState, Tabletops } from "../types";

export const selectTabletop = (
  state: RootState,
  props: { tabletopId: string },
): Tabletops.Props | undefined =>
  state.tabletops.tabletopsById[props.tabletopId];

export const selectPresentState = (
  state: RootState,
  props: { tabletopId: string },
): Tabletops.HistoryState | null =>
  selectTabletop(state, props)?.history.present ?? null;

export const selectStackIds = (
  state: RootState,
  props: { tabletopId: string },
): string[] | null => selectPresentState(state, props)?.stacksIds ?? null;

export const selectStack = (
  state: RootState,
  props: { tabletopId: string; stackId: string },
): Tabletops.Stack | null =>
  selectPresentState(state, props)?.stacksById[props.stackId] ?? null;

export const selectCardInstanceIds = (
  state: RootState,
  props: { stackId: string; tabletopId: string },
): string[] | null => selectStack(state, props)?.cardInstances ?? null;

export const selectCardInstance = (
  state: RootState,
  props: { cardInstanceId: string; tabletopId: string },
): Tabletops.CardInstance | null =>
  selectPresentState(state, props)?.cardInstancesById?.[props.cardInstanceId] ??
  null;

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
