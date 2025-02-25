import React from "react";
import { Cards, Templates } from "@/store/types";
import { useContextSelector } from "use-context-selector";
import * as Types from "./EditCard.types";
import Context from "./EditCard.context";

export default function useEditCardTemplateSchemaItem(props: {
  side: Cards.Side;
  templateSchemaItemId: string;
}): {
  onChange: <T extends Templates.DataType>(
    validatedValue: Types.PartialDataValue<T>,
  ) => void;
  validatedValue: Types.PartialDataValue;
  placeholder?: string;
  hasChanges: boolean;
} {
  const editingItem = useContextSelector(
    Context,
    (context) => context?.state[props.side][props.templateSchemaItemId],
  );

  const hasChanges = useContextSelector(
    Context,
    (context) =>
      context?.state.hasChanges[props.side][props.templateSchemaItemId],
  );

  const editState = useContextSelector(
    Context,
    (context) => context?.editState,
  );

  if (!editingItem || !editState) {
    throw new Error(
      `Template schema item ${props.templateSchemaItemId} not found`,
    );
  }

  const templateId = editingItem.templateId;
  const templateItemId = editingItem.templateItemId;

  const onChange = React.useCallback(
    <T extends Templates.DataType>(value: Types.PartialDataValue<T>) => {
      editState((draft) => {
        const editingItemDraft = draft[props.side][props.templateSchemaItemId];

        const newEditingItem: Types.EditingDataValues<T> = {
          templateId: editingItemDraft?.templateId ?? templateId,
          cardDataItemId: null,
          templateItemId: editingItemDraft?.templateItemId ?? templateItemId,
          type: value.type,
          editValue: value.value ?? null,
          savedValue: null,
        };

        // If the item doesn't exist, it's new
        if (!editingItemDraft) {
          // There's no new value to set anyways so return.
          if (!value.value) return;

          draft[props.side][props.templateSchemaItemId] = newEditingItem;
          draft.hasChanges[props.side][props.templateSchemaItemId] = true;

          return;
        }

        // Don't update something that has no changes
        if (editingItemDraft.editValue === value.value) return;

        if (editingItemDraft.type !== value.type) {
          // NOTE: We should never get to here, it's only if something updated from the api like a
          // new data type change or something. Best never to change data types, just create new
          // ones?
          draft[props.side][props.templateSchemaItemId] = newEditingItem;
          draft.hasChanges[props.side][props.templateSchemaItemId] = true;
        } else {
          editingItemDraft.editValue = value.value ?? null;

          const hasSavedValue = !!editingItemDraft.savedValue;
          const hasEditValue = !!editingItemDraft.editValue;

          // If both values are empty, we don't have any changes
          if (!hasSavedValue && !hasEditValue) {
            draft.hasChanges[props.side][props.templateSchemaItemId] = false;

            return;
          }

          draft.hasChanges[props.side][props.templateSchemaItemId] =
            editingItemDraft.savedValue !== editingItemDraft.editValue;
        }
      });
    },
    [
      props.side,
      props.templateSchemaItemId,
      editState,
      templateItemId,
      templateId,
    ],
  );

  const validatedValue = React.useMemo<Types.PartialDataValue>(() => {
    return {
      type: editingItem.type,
      value: editingItem.editValue,
    } as Types.PartialDataValue;
  }, [editingItem.type, editingItem.editValue]);

  return {
    onChange,
    validatedValue,
    hasChanges: !!hasChanges,
  };
}
