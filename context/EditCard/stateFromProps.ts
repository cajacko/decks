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
import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";

function templateDataItemToEditingDataValue<T extends Templates.FieldType>({
  cardDataItemId,
  item,
}: {
  item: LooseCardTemplateDataItem<T>;
  cardDataItemId: string;
}): Types.EditingDataValues<T> {
  return {
    cardDataItemId,
    savedValidatedValue: item.validatedValue,
    editValidatedValue: item.validatedValue,
    fieldType: item.type,
  };
}

function templateDataToEditingValues(props: {
  front: LooseCardTemplateData;
  back: LooseCardTemplateData;
}) {
  const data: Types.EditDataValueMap = {};
  const templateMapping: Types.EditCardState["templateMapping"] = {
    front: {},
    back: {},
  };

  function processSide(side: Cards.Side) {
    const sideData = props[side];

    for (const templateSchemaId in sideData) {
      const item = sideData[templateSchemaId];

      const cardDataItemId =
        item.cardDataItemId ??
        createCardDataSchemaId({ side, templateDataItemId: templateSchemaId });

      data[cardDataItemId] = templateDataItemToEditingDataValue({
        item: item,
        cardDataItemId,
      });

      templateMapping[side][templateSchemaId] = cardDataItemId;
    }
  }

  processSide("front");
  processSide("back");

  return { data, templateMapping };
}

export default function stateFromProps(props: {
  target?: Target | null;
  front?: LooseCardTemplateData | null;
  back?: LooseCardTemplateData | null;
  stateRef: React.MutableRefObject<Types.EditCardState | null>;
}): Types.EditCardState | null {
  if (!props.target || !props.front || !props.back) {
    return null;
  }

  return {
    target: props.target,
    ...templateDataToEditingValues({
      front: props.front,
      back: props.back,
    }),
    hasChanges: {},
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
}): Types.EditDraftRecipe {
  const { back, front } = props;

  return (draft) => {
    function updateSide(side: Cards.Side) {
      const templateData = side === "front" ? front : back;

      for (const templateSchemaId in templateData) {
        const savedItem = templateData[templateSchemaId];
        const cardDataItemId = savedItem.cardDataItemId;

        if (!cardDataItemId) {
          // TODO: Do we need to do anything here?
          continue;
        }

        const draftItem = draft.data[cardDataItemId];

        // There's no draft item so we can just use the saved info as it is
        // Or there is a type mismatch (which shouldn't really happen unless we have background
        // syncing of data and we're not creating new data items for them). But if we do have a
        // mismatch just use the saved value
        if (!draftItem || draftItem.fieldType !== savedItem.type) {
          draft.data[cardDataItemId] = templateDataItemToEditingDataValue({
            item: savedItem,
            cardDataItemId,
          });

          draft.hasChanges[cardDataItemId] = false;

          continue;
        }

        // There's a new saved value so update the draft item saved item
        if (
          draftItem.savedValidatedValue?.value !==
          savedItem.validatedValue?.value
        ) {
          draftItem.savedValidatedValue = savedItem.validatedValue;
          draftItem.editValidatedValue = savedItem.validatedValue;
        }

        draft.hasChanges[cardDataItemId] = getHasChanges(
          draftItem.editValidatedValue?.value,
          draftItem.savedValidatedValue?.value,
        );
      }
    }

    updateSide("front");
    updateSide("back");
  };
}
