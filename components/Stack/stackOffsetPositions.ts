import { OffsetPosition } from "@/components/Card/Card.types";

export function getOffsetPosition(
  offsetPositions: OffsetPosition[],
  offsetPosition: number | undefined,
): OffsetPosition {
  if (!offsetPosition) return offsetPositions[0];

  const index = offsetPosition % offsetPositions.length;

  return offsetPositions[index];
}

export function withStackOffsetPositions(offsetPositionsCount: number) {
  const positions: [string | null, string | null][] = [];
  let lastProcessedCardIds: string[] | null = null;

  const stackCountLimit = offsetPositionsCount + 1;

  function matchCardAtPosition(
    cardId: string,
  ):
    | { index: number; first: string | null; second: string | null }
    | undefined {
    for (let i = 0; i < offsetPositionsCount; i++) {
      const [first, second] = positions[i] ?? [null, null];

      if (first === cardId || second === cardId) {
        return { index: i, first, second };
      }
    }

    return undefined;
  }

  return {
    stackCountLimit,
    getCardOffsetPosition: (cardId: string): number | undefined => {
      const position = matchCardAtPosition(cardId);

      // This card is not in the stack (how did we get here?)
      if (!lastProcessedCardIds?.includes(cardId)) {
        // The card is still in the positions array, so lets remove it, but keep the other value
        if (position) {
          positions[position.index] = [
            position.first === cardId ? null : position.first,
            position.second === cardId ? null : position.second,
          ];
        }

        // Return undefined as it's not meant to be in the stack
        return undefined;
      }

      // The card is in the stack and we have a position for it already, so return it
      if (position) return position.index;

      // The card is in the stack, but we don't have a position for it, so find a free one

      // If there's any position without any cards, use that
      for (let i = 0; i < offsetPositionsCount; i++) {
        const [first, second] = positions[i] ?? [null, null];

        if (!first && !second) {
          positions[i] = [cardId, null];

          return i;
        }
      }

      // There's at least one card in every position. We now want to put the card next to the in the
      // same position as the front most card we can, so that when the front card animates away
      // there's something behind it.
      for (let i = 0; i < lastProcessedCardIds.length; i++) {
        const lastProcessedCardId = lastProcessedCardIds[i];

        if (!lastProcessedCardId) continue;

        const position = matchCardAtPosition(lastProcessedCardId);

        if (!position) continue;

        // We found this card, lets see if there's an available position next to it

        if (position.first === null) {
          positions[position.index] = [cardId, position.second];

          return position.index;
        }

        if (position.second === null) {
          positions[position.index] = [position.first, cardId];

          return position.index;
        }
      }

      // This is a fallback to fill the first available space, we shouldn't get here though.
      for (let i = 0; i < offsetPositionsCount; i++) {
        const [first, second] = positions[i] ?? [null, null];

        if (!first) {
          positions[i] = [cardId, second];

          return i;
        }

        if (!second) {
          positions[i] = [first, cardId];

          return i;
        }
      }

      // Everything is full, this shouldn't be possible
      return undefined;
    },
    /**
     * Removes any cardIds that are not in the new card list, so we know what gaps we have
     */
    onUpdateCardList: (cardIds: string[]) => {
      // If the cardIds haven't changed, we don't need to do anything
      if (lastProcessedCardIds === cardIds) return;

      for (let i = 0; i < offsetPositionsCount; i++) {
        const [first, second] = positions[i] ?? [null, null];

        const resetFirst = first && !cardIds.includes(first);
        const resetSecond = second && !cardIds.includes(second);

        positions[i] = [resetFirst ? null : first, resetSecond ? null : second];
      }

      lastProcessedCardIds = cardIds;
    },
    // For testing
    _getPositions: (): [string | null, string | null][] => positions,
  };
}
