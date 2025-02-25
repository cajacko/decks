import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateCard, createCard } from "@/store/combinedActions/cards";
import { selectCard } from "@/store/slices/cards";
import {
  useContextSelector,
  useRequiredContextSelector,
} from "./useContextSelector";
import { store } from "@/store/store";
import getUpdateCardData from "./getUpdateCardData";
import uuid from "@/utils/uuid";

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
  const onCreateCard = useContextSelector((context) => context?.onCreateCard);

  const getContextState = useRequiredContextSelector(
    (context) => context?.state.getContextState,
  );

  return React.useCallback(() => {
    const contextState = getContextState();
    const data = getUpdateCardData(contextState);

    if ("cardId" in contextState.cardOrDeckId) {
      dispatch(
        updateCard({
          cardId: contextState.cardOrDeckId.cardId,
          data,
          deckId: getDeckId(contextState.cardOrDeckId.cardId),
        }),
      );
    } else {
      const newCardId = uuid();

      dispatch(
        createCard({
          cardId: newCardId,
          data,
          deckId: contextState.cardOrDeckId.deckId,
        }),
      );

      onCreateCard?.(newCardId);
    }
  }, [getContextState, dispatch, onCreateCard]);
}
