import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { createCardHelper } from "@/store/actionHelpers/cards";
import { setDeckCardDefaults } from "@/store/slices/decks";
import { updateCardHelper } from "@/store/actionHelpers/cards";
import {
  useContextSelector,
  useRequiredContextSelector,
} from "./useContextSelector";
import getUpdateCardData from "./getUpdateCardData";
import uuid from "@/utils/uuid";
import AppError from "@/classes/AppError";
import useAutoSave from "@/hooks/useAutoSave";
import debugLog from "./debugLog";
import { dateToDateString } from "@/utils/dates";

/**
 * Must be used within the EditCard context and with a valid target. Otherwise why is this component
 * rendering?
 */
export default function useSaveEditCard(options?: {
  autoSave?: boolean;
  onAutoSave?: () => void;
}) {
  const autoSave = !!options?.autoSave;
  const onAutoSave = options?.onAutoSave;
  const dispatch = useAppDispatch();
  const onCreateCard = useContextSelector((context) => context?.onCreateCard);
  const setTarget = useRequiredContextSelector((context) => context?.setTarget);

  const getContextState = useRequiredContextSelector(
    (context) => context?.state?.getContextState,
  );

  const getHasChanges = useRequiredContextSelector(
    (context) => context?.state?.getHasChanges,
  );

  const save = React.useCallback((): null => {
    const contextState = getContextState();

    onAutoSave?.();

    switch (contextState.target.type) {
      case "card": {
        debugLog(`${useSaveEditCard.name} - update card`);

        dispatch(
          updateCardHelper({
            cardId: contextState.target.id,
            data: getUpdateCardData(contextState),
          }),
        );

        return null;
      }
      case "new-card-in-deck": {
        debugLog(`${useSaveEditCard.name} - new card`);
        const newCardId = uuid();

        dispatch(
          createCardHelper({
            cardId: newCardId,
            data: getUpdateCardData(contextState),
            deckId: contextState.target.id,
          }),
        );

        // We're now in edit card mode so update the target
        setTarget({ type: "card", id: newCardId });
        onCreateCard?.(newCardId);

        return null;
      }
      case "deck-defaults": {
        debugLog(`${useSaveEditCard.name} - update deck default`);

        dispatch(
          setDeckCardDefaults({
            deckId: contextState.target.id,
            data: getUpdateCardData(contextState),
            date: dateToDateString(new Date()),
          }),
        );

        return null;
      }
      default:
        debugLog(`${useSaveEditCard.name} - unknown target`);

        throw new AppError(
          `${useSaveEditCard.name} could not save card, unexpected target type: ${contextState.target.type}`,
          contextState.target,
        );
    }
  }, [getContextState, dispatch, onCreateCard, setTarget, onAutoSave]);

  useAutoSave({
    save,
    autoSave,
    hasChanges: getHasChanges,
  });

  return {
    save,
    autoSave,
  };
}
