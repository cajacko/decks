import { Cards, Templates } from "@/store/types";
import { CardDataItem } from "@/store/combinedActions/types";
import { EditCardState } from "./EditCard.types";

/**
 * Given the EditCard context state, get the data required by the updateCard action
 */
export default function getUpdateCardData(
  contextState: EditCardState,
): CardDataItem[] {
  const data: CardDataItem[] = [];

  function processSide(side: Cards.Side) {
    const editingValues = contextState[side];

    for (const key in editingValues) {
      // Don't save all for performance and to ensure we keep the hasChanges logic up to date
      if (contextState.hasChanges[side][key] !== true) continue;

      const editingValue = editingValues[key];

      if (!editingValue) continue;

      const value: Templates.ValidatedValue | null = editingValue.editValue
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
        data.push({
          templateDataItemId: editingValue.templateItemId,
          side,
          value,
        });
      }
    }
  }

  processSide("front");
  processSide("back");

  return data;
}
