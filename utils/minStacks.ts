import { Tabletops } from "@/store/types";
import uuid from "@/utils/uuid";

export const minStackCount = 2;

export function createInitStacks(firstStackCardInstances: string[] = []) {
  // Generate stack ids equal to minStackCount
  const stacksIds = Array.from({ length: minStackCount }, () => uuid());

  const stacksById: Tabletops.HistoryState["stacksById"] = stacksIds.reduce(
    (acc, stackId, i) => ({
      ...acc,
      [stackId]: {
        id: stackId,
        cardInstances: i === 0 ? firstStackCardInstances : [],
      },
    }),
    {},
  );

  return { stacksIds, stacksById };
}
