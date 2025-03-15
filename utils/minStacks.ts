import { Tabletops } from "@/store/types";
import uuid from "@/utils/uuid";

export const minStackCount = 2;

export function getStackIdForNewCardsAndReset(
  stackIds: string[],
  tabletopSettings: Tabletops.Settings | null | undefined,
): string | null {
  const lastStack = stackIds[stackIds.length - 1];
  const firstStack = stackIds[0];

  if (tabletopSettings?.newCardsJoinStackNumber) {
    const stackFromSettings =
      stackIds[tabletopSettings.newCardsJoinStackNumber - 1] ?? null;

    return stackFromSettings ?? lastStack ?? firstStack ?? null;
  }

  return firstStack ?? null;
}

export function createInitStacks(
  _cardInstanceIds: string[] | null,
  tabletopSettings: Tabletops.Settings | null,
): Pick<Tabletops.HistoryState, "stacksIds" | "stacksById"> {
  const cardInstances: string[] = _cardInstanceIds ?? [];
  // Generate stack ids equal to minStackCount
  const stacksIds = Array.from({ length: minStackCount }, () => uuid());

  const stacksById: Tabletops.HistoryState["stacksById"] = stacksIds.reduce(
    (acc, stackId, i) => ({
      ...acc,
      [stackId]: {
        id: stackId,
        cardInstances: [],
      },
    }),
    {},
  );

  const stackIdForCardInstances = getStackIdForNewCardsAndReset(
    stacksIds,
    tabletopSettings,
  );

  if (stackIdForCardInstances) {
    const stack = stacksById[stackIdForCardInstances];

    if (stack) {
      stacksById[stackIdForCardInstances] = {
        ...stack,
        cardInstances,
      };
    }
  }

  return { stacksIds, stacksById };
}
