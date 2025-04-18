import { DateString, TimestampMetadata } from "../types";
import { WritableDraft } from "immer";

export type Metadata = Partial<Pick<TimestampMetadata, "dateDeleted">>;

export function getShouldDelete<E extends Metadata>(
  item: E,
  removeAllDeletedBefore: DateString,
): boolean {
  if (!item.dateDeleted) return false;

  const dateDeleted = new Date(item.dateDeleted);
  const deleteIfBefore = new Date(removeAllDeletedBefore);

  return dateDeleted < deleteIfBefore;
}

export function removeDeletedDataFromMap<
  D extends Metadata,
  M extends Record<string, D | undefined>,
>(
  draft: WritableDraft<M>,
  removeAllDeletedBefore: DateString,
): WritableDraft<M> {
  for (const key in draft) {
    const draftItem = draft[key];

    if (draftItem) {
      const shouldDelete = getShouldDelete(draftItem, removeAllDeletedBefore);

      if (shouldDelete) {
        delete draft[key];
      }
    }
  }

  return draft;
}
