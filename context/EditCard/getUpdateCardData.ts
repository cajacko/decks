import {
  SetCardData,
  CardDataItem,
  CreateCardDataItemHelper,
} from "@/store/combinedActions/types";
import { EditCardState } from "./EditCard.types";
import { Cards } from "@/store/types";
import { ValidatedValue, DataItem } from "@/utils/resolveCardData";

type GetValueToSaveProps = Pick<
  DataItem,
  "resolvedValidatedValue" | "savedValidatedValue"
>;

/**
 * null - There are no changes, nothing to save
 * { value: undefined } - The value has been unset, save this (remove from store). Usually done when
 * the user is indicating they want to use the fallback value
 * { value: ValidatedValue } - Save this new value. ValidatedValue might be of type null which
 * indicates the user wants no value to be used (so no fallback)
 */
function getValueToSave(
  item: GetValueToSaveProps,
):
  | null
  | { value: ValidatedValue; type: "new-value" }
  | { value: undefined; type: "unset" } {
  // The values we're displaying and have saved are the same, and come from the same place, so
  // there's definitely no changes
  if (
    item.resolvedValidatedValue?.value === item.savedValidatedValue?.value &&
    item.resolvedValidatedValue?.origin === item.savedValidatedValue?.origin
  ) {
    return null;
  }

  // We have an editing value, but that value is currently the same as the saved one, so don't save
  // anything, the user is probably typing
  if (
    item.resolvedValidatedValue?.origin === "editing" &&
    item.resolvedValidatedValue?.value === item.savedValidatedValue?.value
  ) {
    return null;
  }

  // The value we're using isn't a value we're editing. It must be a fallback value. We've already
  // checked higher up if the saved value is being used as the resolved value, so this must be a
  // fallback value
  if (item.resolvedValidatedValue?.origin !== "editing") {
    // We already don't have a saved value, so don't save anything
    if (item.savedValidatedValue === undefined) {
      return null;
    }

    return {
      type: "unset",
      value: undefined,
    };
  }

  return {
    type: "new-value",
    value: item.resolvedValidatedValue,
  };
}

export function getHasChanges(item: GetValueToSaveProps): boolean {
  return !!getValueToSave(item);
}

/**
 * Given the EditCard context state, get the data required by the updateCard action
 */
export default function getUpdateCardData(
  contextState: EditCardState,
): SetCardData {
  const items: CardDataItem[] = [];

  function processSide(side: Cards.Side) {
    const dataByCardDataId = contextState.dataByCardDataId[side];

    for (const cardDataId in dataByCardDataId) {
      const dataItem = dataByCardDataId[cardDataId];

      if (!dataItem) continue;

      const valueToSave = getValueToSave(dataItem);

      items.push({
        cardDataId: dataItem.dataId,
        validatedValue: valueToSave?.value,
        fieldType: dataItem.fieldType,
        // Best we can get without going cra cra
      } satisfies CreateCardDataItemHelper as CardDataItem);
    }
  }

  processSide("front");
  processSide("back");

  return {
    items,
    templateMapping: contextState.dataIdByTemplateDataId,
  };
}
