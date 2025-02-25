import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateCard } from "@/store/combinedActions/cards";
import { selectCard } from "@/store/slices/cards";
import { useRequiredContextSelector } from "./useContextSelector";
import { store } from "@/store/store";
import getUpdateCardData from "./getUpdateCardData";

/**
 * Get the deckId outside of the UI render cycle, otherwise we'd use react-redux
 *
 * No UI components need this, so we're doing it here
 */
function getDeckId(cardId: string): string {
  const deckId = selectCard(store.getState(), { cardId })?.deckId;

  if (!deckId) {
    throw new Error(`Deck not found for card ${cardId}`);
  }

  return deckId;
}

export default function useSaveEditCard(): () => void {
  const dispatch = useAppDispatch();

  const getContextState = useRequiredContextSelector(
    (context) => context?.state.getContextState,
  );

  return React.useCallback(() => {
    const contextState = getContextState();
    const data = getUpdateCardData(contextState);

    dispatch(
      updateCard({
        cardId: contextState.cardId,
        data,
        deckId: getDeckId(contextState.cardId),
      }),
    );
  }, [getContextState, dispatch]);
}
