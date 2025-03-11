import {
  SetCardData,
  CardDataItem,
  CreateCardDataItemHelper,
} from "@/store/combinedActions/types";
import { EditCardState } from "./EditCard.types";
import { Cards } from "@/store/types";

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
      const data = dataByCardDataId[cardDataId];

      if (!data) continue;

      // Don't save all for performance and to ensure we keep the hasChanges logic up to date
      if (
        data.resolvedValidatedValue?.value === data.savedValidatedValue?.value
      )
        continue;

      items.push({
        cardDataId: data.dataId,
        validatedValue: data.resolvedValidatedValue,
        fieldType: data.fieldType,
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
