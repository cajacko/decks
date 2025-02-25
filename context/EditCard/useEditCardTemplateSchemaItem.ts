import React from "react";
import { Cards, Templates } from "@/store/types";
import {
  useRequiredContextSelector,
  useContextSelector,
} from "./useContextSelector";
import * as Types from "./EditCard.types";

function withOnChange(props: {
  editState: Types.EditState;
  side: Cards.Side;
  templateId: Templates.TemplateId;
  templateSchemaItemId: Templates.DataItemId;
}): Types.UseEditCardTemplateSchemaItemReturn["onChange"] {
  const { editState, templateId } = props;

  return <T extends Templates.DataType>(value: Types.PartialDataValue<T>) => {
    editState((draft) => {
      const editingItemDraft = draft[props.side][props.templateSchemaItemId];

      const newEditingItem: Types.EditingDataValues<T> = {
        templateId: editingItemDraft?.templateId ?? templateId,
        cardDataItemId: null,
        templateItemId:
          editingItemDraft?.templateItemId ?? props.templateSchemaItemId,
        type: value.type,
        editValue: value.value ?? null,
        savedValue: null,
      };

      // If the item doesn't exist, it's new so add it
      if (!editingItemDraft) {
        // There's no new value to set anyways so return.
        if (!value.value) return;

        draft[props.side][props.templateSchemaItemId] = newEditingItem;
        draft.hasChanges[props.side][props.templateSchemaItemId] = true;

        return;
      }

      // Don't update something that has no changes
      if (editingItemDraft.editValue === value.value) return;

      // NOTE: We should never get to here, it's only if something updated from the api like a
      // new data type change or something. Best never to change data types, just create new
      // ones?
      if (editingItemDraft.type !== value.type) {
        draft[props.side][props.templateSchemaItemId] = newEditingItem;
        draft.hasChanges[props.side][props.templateSchemaItemId] = true;

        return;
      }

      // The value is different and the same type, lets update it normally

      editingItemDraft.editValue = value.value ?? null;

      const hasSavedValue = !!editingItemDraft.savedValue;
      const hasEditValue = !!editingItemDraft.editValue;

      // If both values are empty, we don't have any changes
      // This fixes an issue where we had null/ undefined or "" values and them being treated as
      // changes, whereas for the user they are not
      if (!hasSavedValue && !hasEditValue) {
        draft.hasChanges[props.side][props.templateSchemaItemId] = false;

        return;
      }

      // Update if we have changes or not
      draft.hasChanges[props.side][props.templateSchemaItemId] =
        editingItemDraft.savedValue !== editingItemDraft.editValue;
    });
  };
}

export default function useEditCardTemplateSchemaItem(props: {
  side: Cards.Side;
  templateSchemaItemId: string;
}): Types.UseEditCardTemplateSchemaItemReturn {
  const editingItem = useRequiredContextSelector(
    (context) => context?.state[props.side][props.templateSchemaItemId],
  );

  const hasChanges = useContextSelector(
    (context) =>
      context?.state.hasChanges[props.side][props.templateSchemaItemId],
  );

  const editState = useRequiredContextSelector((context) => context?.editState);

  const onChange = React.useMemo<
    Types.UseEditCardTemplateSchemaItemReturn["onChange"]
  >(
    () =>
      withOnChange({
        editState,
        side: props.side,
        templateId: editingItem.templateId,
        templateSchemaItemId: props.templateSchemaItemId,
      }),
    [props.side, props.templateSchemaItemId, editState, editingItem.templateId],
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
