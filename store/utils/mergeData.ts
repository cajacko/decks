import { TimestampMetadata } from "../types";
import { WritableDraft } from "immer";

export type Metadata = Pick<TimestampMetadata, "dateUpdated">;

/**
 * We prioritise the existing item if dates are the same. This usually prevents the most state
 * changes. We have to make a decision either way, so we assume that the existing items are the same
 */
export function getMostRecentItem<E extends Metadata, I extends Metadata>({
  existing,
  incoming,
}: {
  existing: E;
  incoming: I;
}): E | I {
  const existingLastUpdated = new Date(existing.dateUpdated);
  const incomingLastUpdated = new Date(incoming.dateUpdated);

  // We assume that equal dates mean the same item (do as little change as possible)
  if (incomingLastUpdated <= existingLastUpdated) {
    return existing;
  }

  return incoming;
}

// TODO: Deleted stuff. Can we safely remove during the sync process?
// Maybe have a version of push that strips all deleted entries?

export function mergeMap<
  D extends Metadata,
  M extends Record<string, D | undefined>,
>(draft: WritableDraft<M>, incoming: M) {
  for (const key in draft) {
    const incomingItem: D | undefined = incoming[key];

    // Nothing to merge, do nothing to the draft
    if (!incomingItem) return;

    const draftItem = draft[key];

    if (draftItem) {
      const latestItem = getMostRecentItem({
        existing: draftItem,
        incoming: incomingItem,
      });

      // We assume that equal dates mean the same item (do as little change as possible)
      if (latestItem === draftItem) {
        continue;
      }
    }

    // @ts-ignore
    draft[key] = incomingItem;
  }
}
