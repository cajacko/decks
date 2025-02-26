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
import AppError from "@/classes/AppError";

/**
 * Get the deckId outside of the UI render cycle, otherwise we'd use react-redux
 *
 * No UI components need this, so we're doing it here
 */
function getDeckId(cardId: string): string {
  const deckId = selectCard(store.getState(), { cardId })?.deckId;

  if (!deckId) {
    throw new AppError(`${getDeckId.name}: Deck not found for card ${cardId}`);
  }

  return deckId;
}

/**
 * Must be used within the EditCard context and with a valid target. Otherwise why is this component
 * rendering?
 */
export default function useSaveEditCard(): () => void {
  const dispatch = useAppDispatch();
  const onCreateCard = useContextSelector((context) => context?.onCreateCard);

  const getContextState = useRequiredContextSelector(
    (context) => context?.state?.getContextState,
  );

  return React.useCallback((): null => {
    const contextState = getContextState();
    const data = getUpdateCardData(contextState);

    switch (contextState.target.type) {
      case "card": {
        dispatch(
          updateCard({
            cardId: contextState.target.id,
            data,
            deckId: getDeckId(contextState.target.id),
          }),
        );

        return null;
      }
      case "new-card-in-deck": {
        const newCardId = uuid();

        dispatch(
          createCard({
            cardId: newCardId,
            data,
            deckId: contextState.target.id,
          }),
        );

        onCreateCard?.(newCardId);

        return null;
      }
      default:
        throw new AppError(
          `${useSaveEditCard.name} could not save card, unexpected target type: ${contextState.target.type}`,
          contextState.target,
        );
    }
  }, [getContextState, dispatch, onCreateCard]);
}
