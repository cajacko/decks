import { WritableDraft } from "immer";

export default function removeFromArray<T>(
  draft: WritableDraft<T[]>,
  getShouldRemove: (item: WritableDraft<T[]>[number]) => boolean,
) {
  // Don't use filter as this would create new arrays even if the item doesn't exist in this stack
  // Loop backwards to safely remove items while iterating
  for (let i = draft.length - 1; i >= 0; i--) {
    if (getShouldRemove(draft[i])) {
      draft.splice(i, 1); // Remove the card instance
    }
  }
}
