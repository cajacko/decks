import React from "react";
import { Cards, Templates } from "@/store/types";
import {
  useRequiredContextSelector,
  useContextSelector,
} from "./useContextSelector";
import * as Types from "./EditCard.types";
import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";
import { getHasChanges } from "./getUpdateCardData";

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

  const resolvedValidatedValue = useContextSelector((context) =>
    cardDataItemId
      ? context?.state?.dataByCardDataId[props.side][cardDataItemId]
          ?.resolvedValidatedValue
      : undefined,
  );

  const savedValidatedValue = useContextSelector((context) =>
    cardDataItemId
      ? context?.state?.dataByCardDataId[props.side][cardDataItemId]
          ?.savedValidatedValue
      : undefined,
  );

  const fallbackValidatedValue = useContextSelector((context) =>
    cardDataItemId
      ? context?.state?.dataByCardDataId[props.side][cardDataItemId]
          ?.fallbackValidatedValue
      : undefined,
  );

  const hasChanges = React.useMemo(
    () =>
      getHasChanges({
        resolvedValidatedValue,
        savedValidatedValue,
      }),
    [resolvedValidatedValue, savedValidatedValue],
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

  return {
    onChange,
    validatedValue: resolvedValidatedValue,
    hasChanges: !!hasChanges,
    usingFallback:
      resolvedValidatedValue?.origin === fallbackValidatedValue?.origin
        ? (fallbackValidatedValue?.origin ?? "template")
        : null,
  };
}
