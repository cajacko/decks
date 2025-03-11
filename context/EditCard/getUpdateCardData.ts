import {
  SetCardData,
  CardDataItem,
  CreateCardDataItemHelper,
} from "@/store/combinedActions/types";
import { EditCardState } from "./EditCard.types";

/**
 * Given the EditCard context state, get the data required by the updateCard action
 */
export default function getUpdateCardData(
  contextState: EditCardState,
): SetCardData {
  const items: CardDataItem[] = [];

  const editingValues = contextState.data;

  for (const key in editingValues) {
    // Don't save all for performance and to ensure we keep the hasChanges logic up to date
    if (contextState.hasChanges[key] !== true) continue;

    const editingValue = editingValues[key];

    if (!editingValue) continue;

    items.push({
      cardDataId: editingValue.cardDataItemId,
      validatedValue: editingValue.editValidatedValue,
      fieldType: editingValue.fieldType,
      // Best we can get without going cra cra
    } satisfies CreateCardDataItemHelper as CardDataItem);
  }

  return {
    items,
    templateMapping: contextState.templateMapping,
  };
}
