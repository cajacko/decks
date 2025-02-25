import { Cards, Templates } from "@/store/types";
import { CardDataItem } from "@/store/combinedActions/cards";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import { store } from "@/store/store";
import { EditCardState } from "./EditCard.types";

/**
 * Get the template schema item title outside of the UI render cycle, otherwise we'd use react-redux
 * This is used as the card/deck data item title if we're dynamically adding it from the template
 * schema. Which happens when we pick templates first and don't define data schemas first. Which is
 * nicer for the user
 *
 * No UI components need this, so we're doing it here
 */
function getTemplateSchemaItemTitle(props: {
  templateId: Templates.TemplateId;
  templateSchemaItemId: Templates.DataItemId;
}): string {
  const templateDataItemTitle = selectTemplateSchemaItem(
    store.getState(),
    props,
  )?.name;

  if (!templateDataItemTitle) {
    throw new Error(
      `Template data item not found for template ${props.templateId} and item ${props.templateSchemaItemId}`,
    );
  }

  return templateDataItemTitle;
}

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
          templateDataItemTitle: getTemplateSchemaItemTitle({
            templateId: editingValue.templateId,
            templateSchemaItemId: editingValue.templateItemId,
          }),
        });
      }
    }
  }

  processSide("front");
  processSide("back");

  return data;
}
