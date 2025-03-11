import React from "react";
import { Cards, Templates } from "@/store/types";
import {
  useRequiredContextSelector,
  useContextSelector,
} from "./useContextSelector";
import * as Types from "./EditCard.types";
import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";

export default function useEditCardTemplateSchemaItem(props: {
  side: Cards.Side;
  templateDataId: Templates.DataId;
  templateId: Templates.Id;
}): Types.UseEditCardTemplateSchemaItemReturn {
  const cardDataItemId =
    useContextSelector(
      (context) =>
        context?.state?.dataIdByTemplateDataId[props.side][
          props.templateDataId
        ],
    ) ??
    createCardDataSchemaId({
      side: props.side,
      templateDataItemId: props.templateDataId,
    });

  const editingItem = useContextSelector((context) =>
    cardDataItemId
      ? context?.state?.dataByCardDataId[props.side][cardDataItemId]
      : undefined,
  );

  const hasChanges = useContextSelector(
    (context) =>
      context?.state?.hasChanges?.[props.side]?.byTemplateDataId?.[
        props.templateDataId
      ],
  );

  const updateEditingDataItem = useRequiredContextSelector(
    (context) => context?.updateEditingDataItem,
  );

  const onChange = React.useCallback<
    Types.UseEditCardTemplateSchemaItemReturn["onChange"]
  >(
    (validatedValue) =>
      updateEditingDataItem({
        side: props.side,
        templateDataId: props.templateDataId,
        validatedValue,
      }),
    [updateEditingDataItem, props.side, props.templateDataId],
  );

  const validatedValue = editingItem?.resolvedValidatedValue;

  let usingDefault: Types.DefaultValueLocation | null;

  switch (validatedValue?.origin) {
    case undefined:
    case "card":
    case "editing":
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
    validatedValue,
    hasChanges: !!hasChanges,
    usingDefault,
  };
}
