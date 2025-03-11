import React from "react";
import { Cards, Templates } from "@/store/types";
import {
  useRequiredContextSelector,
  useContextSelector,
} from "./useContextSelector";
import * as Types from "./EditCard.types";
import getHasChanges from "./getHasChanges";
import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";
// import { useAppSelector } from "@/store/hooks";
// import { useAppSelector } from "@/store/hooks";
// import { selectTemplateSchemaItem } from "@/store/slices/templates";

function withOnChange(props: {
  editState: Types.EditState;
  cardDataItemId: string;
  fieldType: Templates.FieldType;
}): Types.UseEditCardTemplateSchemaItemReturn["onChange"] {
  const { editState, cardDataItemId, fieldType } = props;

  return (value: Templates.ValidatedValue | undefined) => {
    editState((draft) => {
      const editingItemDraft = draft.data[cardDataItemId];

      // If the item doesn't exist, it's new so add it
      if (!editingItemDraft) {
        // There's no new value to set anyways so return.
        if (!value) return;

        draft.data[cardDataItemId] = {
          cardDataItemId,
          savedValidatedValue: undefined,
          editValidatedValue: value,
          fieldType,
        };

        draft.hasChanges[cardDataItemId] = true;

        return;
      }

      // Don't update something that has no changes
      if (editingItemDraft.editValidatedValue?.value === value?.value) return;

      // NOTE: We should never get to here, it's only if something updated from the api like a
      // new data type change or something. Best never to change data types, just create new
      // ones?
      if (editingItemDraft.fieldType !== fieldType) {
        draft.data[cardDataItemId] = {
          cardDataItemId,
          savedValidatedValue: undefined,
          editValidatedValue: value,
          fieldType,
        };

        draft.hasChanges[cardDataItemId] = true;

        return;
      }

      // The value is different and the same type, lets update it normally
      editingItemDraft.editValidatedValue = value;

      const hasChanges = getHasChanges(
        editingItemDraft.editValidatedValue?.value,
        editingItemDraft.savedValidatedValue?.value,
      );

      // Update if we have changes or not
      draft.hasChanges[cardDataItemId] = hasChanges;
    });
  };
}

export default function useEditCardTemplateSchemaItem(props: {
  side: Cards.Side;
  templateSchemaItemId: string;
  templateId: string;
  fieldType: Templates.FieldType;
}): Types.UseEditCardTemplateSchemaItemReturn {
  const fieldType = props.fieldType;
  const cardDataItemId =
    useContextSelector(
      (context) =>
        context?.state?.templateMapping[props.side][props.templateSchemaItemId],
    ) ??
    createCardDataSchemaId({
      side: props.side,
      templateDataItemId: props.templateSchemaItemId,
    });

  const editingItem = useContextSelector((context) =>
    cardDataItemId ? context?.state?.data[cardDataItemId] : undefined,
  );

  const hasChanges = useContextSelector((context) =>
    cardDataItemId ? context?.state?.hasChanges[cardDataItemId] : undefined,
  );

  const editState = useRequiredContextSelector((context) => context?.editState);

  const onChange = React.useMemo<
    Types.UseEditCardTemplateSchemaItemReturn["onChange"]
  >(
    () =>
      withOnChange({
        editState,
        cardDataItemId,
        fieldType,
      }),
    [cardDataItemId, editState, fieldType],
  );

  const validatedValue =
    editingItem?.editValidatedValue === undefined
      ? editingItem?.savedValidatedValue
      : editingItem?.editValidatedValue;

  let usingDefault: Types.DefaultValueLocation | null;

  switch (validatedValue?.origin) {
    case undefined:
    case "card":
    default:
      usingDefault = null;
      break;
    case "deck":
      usingDefault = "deck";
      break;
    case "template":
      usingDefault = "template";
      break;
    case "template-map":
      usingDefault = "template-map";
      break;
  }

  return {
    onChange,
    fieldType,
    validatedValue,
    hasChanges: !!hasChanges,
    usingDefault,
  };
}
