import React from "react";
import { Cards, Templates } from "@/store/types";
import {
  LooseCardTemplateData,
  LooseCardTemplateDataItem,
} from "@/store/combinedSelectors/cards";
import * as Types from "./EditCard.types";
import getHasChanges from "./getHasChanges";
import { Target } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";

function templateDataItemToEditingDataValue<T extends Templates.DataType>(
  item: LooseCardTemplateDataItem<T>,
  templateId: Templates.TemplateId,
): Types.EditingDataValues<T> {
  const value = item.validatedValue?.value;

  return {
    templateId,
    cardDataItemId: item.cardDataItemId,
    templateItemId: item.id,
    type: item.type,
    savedValue: value ?? null,
    editValue: value ?? null,
  };
}

function templateDataToEditingValues(
  data: LooseCardTemplateData,
  templateId: Templates.TemplateId,
): Types.EditDataValueMap {
  const result: Types.EditDataValueMap = {};

  for (const key in data) {
    result[key] = templateDataItemToEditingDataValue(data[key], templateId);
  }

  return result;
}

export default function stateFromProps(props: {
  target?: Target | null;
  front?: LooseCardTemplateData | null;
  back?: LooseCardTemplateData | null;
  frontTemplateId?: Templates.TemplateId | null;
  backTemplateId?: Templates.TemplateId | null;
  stateRef: React.MutableRefObject<Types.EditCardState | null>;
}): Types.EditCardState | null {
  if (
    !props.target ||
    !props.front ||
    !props.back ||
    !props.frontTemplateId ||
    !props.backTemplateId
  ) {
    return null;
  }

  return {
    target: props.target,
    front: templateDataToEditingValues(props.front, props.frontTemplateId),
    back: templateDataToEditingValues(props.back, props.backTemplateId),
    hasChanges: {
      back: {},
      front: {},
    },
    getContextState: () => {
      if (!props.stateRef.current) {
        throw new AppError(
          "getContextState called before state was initialised in EditCardProvider",
        );
      }

      return props.stateRef.current;
    },
  };
}

export function withUpdateStateFromProps(props: {
  front: LooseCardTemplateData;
  back: LooseCardTemplateData;
  frontTemplateId: Templates.TemplateId;
  backTemplateId: Templates.TemplateId;
}): Types.EditDraftRecipe {
  const { back, backTemplateId, front, frontTemplateId } = props;

  return (draft) => {
    function updateSide(side: Cards.Side) {
      const templateId = side === "front" ? frontTemplateId : backTemplateId;
      const data = side === "front" ? front : back;

      for (const key in data) {
        const savedItem = data[key];
        const draftItem = draft[side][key];

        // There's no draft item so we can just use the saved info as it is
        // Or there is a type mismatch (which shouldn't really happen unless we have background
        // syncing of data and we're not creating new data items for them). But if we do have a
        // mismatch just use the saved value
        if (
          !draftItem ||
          (draftItem.type !== savedItem.type &&
            draftItem.type !== Templates.DataType.Null)
        ) {
          draft[side][key] = templateDataItemToEditingDataValue(
            savedItem,
            templateId,
          );

          draft.hasChanges[side][key] = false;

          continue;
        }

        const savedItemValue = savedItem.validatedValue?.value ?? null;

        // There's a new saved value so update the draft item saved item
        if (draftItem.savedValue !== savedItemValue) {
          draftItem.savedValue = savedItemValue;
        }

        draft.hasChanges[side][key] = getHasChanges(
          draftItem.editValue,
          draftItem.savedValue,
        );
      }
    }

    updateSide("front");
    updateSide("back");
  };
}
