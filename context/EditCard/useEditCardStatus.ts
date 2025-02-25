import React from "react";
import { Cards, Templates } from "@/store/types";
import { useAppDispatch } from "@/store/hooks";
import { updateCard, CardDataItem } from "@/store/combinedActions/cards";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import { useContextSelector } from "use-context-selector";
import { store } from "@/store/store";
import Context from "./EditCard.context";

export default function useEditCardStatus(): {
  save: () => void;
  hasChanges: boolean;
} {
  const dispatch = useAppDispatch();

  const hasChangesMap = useContextSelector(
    Context,
    (context) => context?.state.hasChanges,
  );

  const getContextState = useContextSelector(
    Context,
    (context) => context?.state.getContextState,
  );

  if (!getContextState || !hasChangesMap) {
    throw new Error("EditCardStatus must be used within a EditCardProvider");
  }

  const hasChanges = React.useMemo(
    () =>
      Object.values(hasChangesMap.front).some((hasChanges) => !!hasChanges) ||
      Object.values(hasChangesMap.back).some((hasChanges) => !!hasChanges),
    [hasChangesMap],
  );

  return {
    save: React.useCallback(() => {
      const contextState = getContextState();

      const data: CardDataItem[] = [];

      function processSide(side: Cards.Side) {
        const editingValues = contextState[side];

        for (const key in editingValues) {
          // Don't save all for performance and to ensure we keep the hasChanges logic up to date
          if (contextState.hasChanges[side][key] !== true) continue;

          const editingValue = editingValues[key];

          if (editingValue) {
            const value: Templates.ValidatedValue | null =
              editingValue.editValue
                ? ({
                    type: editingValue.type,
                    value: editingValue.editValue,
                  } as Templates.ValidatedValue) // FIXME:
                : null;

            if (editingValue.cardDataItemId) {
              data.push({
                cardDataId: editingValue.cardDataItemId,
                value,
              });
            } else {
              const templateDataItemTitle = selectTemplateSchemaItem(
                store.getState(),
                {
                  templateId: editingValue.templateId,
                  templateSchemaItemId: editingValue.templateItemId,
                },
              )?.name;

              if (!templateDataItemTitle) {
                throw new Error(
                  `Template data item ${editingValue.templateItemId} not found`,
                );
              }

              data.push({
                templateDataItemId: editingValue.templateItemId,
                side,
                value,
                templateDataItemTitle,
              });
            }
          }
        }
      }

      processSide("front");
      processSide("back");

      dispatch(
        updateCard({
          cardId: contextState.cardId,
          data,
          deckId: contextState.deckId,
        }),
      );
    }, [getContextState, dispatch]),
    hasChanges,
  };
}
