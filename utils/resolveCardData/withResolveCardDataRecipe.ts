import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";
import * as Types from "./types";
import { Cards, Templates } from "@/store/types";
import { WritableDraft } from "immer";
import { getFlag } from "@/store/combinedSelectors/flags";

function addItemRecipe(
  draft: WritableDraft<Types.ResolvedCardData>,
  props: {
    cardDataId: Cards.Id;
    validatedValue: Templates.ValidatedValue | undefined;
    fieldType: Templates.FieldType | null;
    origin: Types.ValueOrigin;
    side: Cards.Side | null;
  },
) {
  function addSideItem(side: Cards.Side) {
    const existingItem = draft.dataByCardDataId[side][props.cardDataId];

    // FIXME: Draftify this
    const validatedValue = props.validatedValue && {
      ...props.validatedValue,
      origin: props.origin,
    };

    let savedValidatedValue: Types.CreateDataItemHelper["savedValidatedValue"] =
      existingItem?.savedValidatedValue;

    if (savedValidatedValue === undefined && props.origin !== "editing") {
      savedValidatedValue = props.validatedValue && {
        ...props.validatedValue,
        origin: props.origin,
      };
    }

    const newItem: Types.DataItem = {
      dataId: props.cardDataId,
      fieldType: existingItem?.fieldType || props.fieldType,
      resolvedValidatedValue: validatedValue,
      editingValidatedValue:
        props.origin === "editing" ? props.validatedValue : undefined,
      savedValidatedValue,
    } satisfies Types.CreateDataItemHelper as Types.DataItem;

    draft.dataByCardDataId[side][props.cardDataId] = newItem;
  }

  // Only add side specific data if it's not a shared value
  if (props.side) {
    switch (props.origin) {
      case "template":
      case "template-map":
        addSideItem(props.side);
        return;
    }
  }

  addSideItem("front");
  addSideItem("back");
}

function addTemplateMappingRecipe(
  draft: WritableDraft<Types.ResolvedCardData>,
  props: {
    side: Cards.Side;
    templateDataId: Templates.DataId;
    cardDataId: Cards.DataId;
  },
) {
  const newValue =
    draft.dataByCardDataId[props.side][props.cardDataId]?.resolvedValidatedValue
      ?.value;

  const existingValue =
    draft.resolvedDataValues[props.side][props.templateDataId];

  if (existingValue !== newValue) {
    draft.resolvedDataValues[props.side][props.templateDataId] = newValue;
  }

  if (
    draft.dataIdByTemplateDataId[props.side][props.templateDataId] !==
    props.cardDataId
  ) {
    draft.dataIdByTemplateDataId[props.side][props.templateDataId] =
      props.cardDataId;
  }
}

export function withUpdateEditingDataItemRecipe(props: Types.UpdatedDataItem) {
  return (draft: WritableDraft<Types.ResolvedCardData>): void => {
    if (getFlag("DEBUG_RESOLVE_CARD_DATA")) {
      draft._debugCount = draft._debugCount + 1;
    }

    const cardDataId =
      draft.dataIdByTemplateDataId[props.side][props.templateDataId] ??
      createCardDataSchemaId({
        side: props.side,
        templateDataItemId: props.templateDataId,
      });

    addItemRecipe(draft, {
      ...props,
      cardDataId,
      fieldType: null,
      origin: "editing",
    });

    addTemplateMappingRecipe(draft, {
      ...props,
      cardDataId,
    });
  };
}

// Our selector for the card template would use this
export default function withResolveCardDataRecipe(
  props: Types.ResolveCardDataProps | null,
) {
  return (draft: WritableDraft<Types.ResolvedCardData>): void => {
    if (getFlag("DEBUG_RESOLVE_CARD_DATA")) {
      draft._debugCount = draft._debugCount + 1;
    }

    const safeIds: {
      cardDataIds: Record<string, boolean | undefined>;
      templateDataIds: Record<Cards.Side, Record<string, boolean | undefined>>;
    } = {
      cardDataIds: {},
      templateDataIds: {
        back: {},
        front: {},
      },
    };

    function addItem(props: {
      cardDataId: Cards.Id;
      validatedValue: Templates.ValidatedValue | undefined;
      fieldType: Templates.FieldType | null;
      origin: Types.ValueOrigin;
      side: Cards.Side | null;
    }) {
      safeIds.cardDataIds[props.cardDataId] = true;

      addItemRecipe(draft, props);
    }

    function addTemplateMapping(props: {
      side: Cards.Side;
      templateDataId: Templates.DataId;
      cardDataId: Cards.DataId;
    }) {
      safeIds.cardDataIds[props.cardDataId] = true;
      safeIds.templateDataIds[props.side][props.templateDataId] = true;

      addTemplateMappingRecipe(draft, props);
    }

    if (props?.cardData) {
      for (const cardDataId in props.cardData) {
        addItem({
          cardDataId,
          validatedValue: props.cardData[cardDataId],
          fieldType: null,
          origin: "card",
          side: null,
        });
      }
    }

    if (props?.deckDataSchema) {
      for (const cardDataId in props.deckDataSchema) {
        const dataSchemaItem = props.deckDataSchema[cardDataId];

        addItem({
          cardDataId,
          validatedValue: dataSchemaItem?.defaultValidatedValue,
          fieldType: dataSchemaItem?.type ?? null,
          origin: "deck",
          side: null,
        });
      }
    }

    function processSide(
      side: Cards.Side,
      type: "dataTemplateMapping" | "schema",
    ) {
      const { dataTemplateMapping, schema } = props?.templates?.[side] ?? {};

      if (dataTemplateMapping && type === "dataTemplateMapping") {
        for (const templateDataId in dataTemplateMapping) {
          const dataTemplateMapItem = dataTemplateMapping[templateDataId];

          const cardDataId =
            dataTemplateMapItem?.dataId ??
            createCardDataSchemaId({
              side,
              templateDataItemId: templateDataId,
            });

          addItem({
            cardDataId,
            validatedValue: dataTemplateMapItem?.defaultValidatedValue,
            fieldType: null,
            origin: "template-map",
            side,
          });

          addTemplateMapping({
            side,
            templateDataId,
            cardDataId,
          });
        }
      }

      if (schema && type === "schema") {
        for (const templateDataId in schema) {
          const schemaItem = schema[templateDataId];

          const cardDataId =
            draft.dataIdByTemplateDataId[side][templateDataId] ??
            createCardDataSchemaId({
              side,
              templateDataItemId: templateDataId,
            });

          addItem({
            cardDataId,
            validatedValue: schemaItem?.defaultValidatedValue,
            fieldType: schemaItem?.type ?? null,
            origin: "template",
            side,
          });

          addTemplateMapping({
            side,
            templateDataId,
            cardDataId,
          });
        }
      }
    }

    processSide("front", "dataTemplateMapping");
    processSide("back", "dataTemplateMapping");
    processSide("front", "schema");
    processSide("back", "schema");

    // Clean up any data that is no longer needed

    function cleanUpSide(side: Cards.Side) {
      Object.keys(draft.dataByCardDataId[side]).forEach((cardDataId) => {
        if (safeIds.cardDataIds[cardDataId]) return;

        delete draft.dataByCardDataId[side][cardDataId];
        delete draft.resolvedDataValues[side][cardDataId];
      });

      Object.keys(draft.dataIdByTemplateDataId[side]).forEach(
        (templateDataId) => {
          if (safeIds.templateDataIds[side][templateDataId]) return;

          delete draft.dataIdByTemplateDataId[side][templateDataId];
        },
      );
    }

    cleanUpSide("front");
    cleanUpSide("back");
  };
}
