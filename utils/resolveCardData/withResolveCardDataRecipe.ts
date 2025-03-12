import createCardDataSchemaId from "@/store/utils/createCardDataSchemaId";
import * as Types from "./types";
import { Cards, Templates } from "@/store/types";
import { WritableDraft } from "immer";
import { getFlag } from "@/store/combinedSelectors/flags";

const originPriority: Types.ValueOrigin[] = [
  "editing",
  "card",
  "deck-defaults",
  "template",
  "template-map",
];

const canSetAsFallbackMap: Record<Types.ValueOrigin, boolean> = {
  "deck-defaults": true,
  template: true,
  "template-map": true,
  card: false,
  editing: false,
};

const canSetAsSavedMap: Record<Types.ValueOrigin, boolean> = {
  card: true,
  "deck-defaults": true,
  template: false,
  "template-map": false,
  editing: false,
};

function addItemRecipe(
  draft: WritableDraft<Types.ResolvedCardData>,
  props: {
    cardDataId: Cards.Id;
    validatedValue: Templates.ValidatedValue | undefined;
    fieldType: Templates.FieldType | undefined;
    origin: Types.ValueOrigin;
    side: Cards.Side | null;
  },
) {
  const canSetAsFallback =
    canSetAsFallbackMap[props.origin] && draft.targetOrigin !== props.origin;

  const canSetAsSaved =
    canSetAsSavedMap[props.origin] && draft.targetOrigin === props.origin;

  const higherPriorities = originPriority.slice(
    0,
    originPriority.indexOf(props.origin),
  );

  function addSideItem(side: Cards.Side) {
    const existingItem = draft.dataByCardDataId[side][props.cardDataId];

    const item: Types.CreateDataItemHelper = existingItem ?? {
      dataId: props.cardDataId,
      fieldType: props.fieldType,
      resolvedValidatedValue: undefined,
      fallbackValidatedValue: undefined,
      savedValidatedValue: undefined,
    };

    if (item.fieldType === undefined && props.fieldType) {
      item.fieldType = props.fieldType;
    }

    function setValue<
      Prop extends keyof Pick<
        Types.CreateDataItemHelper,
        | "fallbackValidatedValue"
        | "resolvedValidatedValue"
        | "savedValidatedValue"
      >,
    >(prop: Prop, validatedValue: Types.ValidatedValue | undefined) {
      const existingValidatedValue = item[prop];

      // An existing value exists with a higher priority, so don't overwrite it
      if (
        existingValidatedValue?.origin &&
        higherPriorities.includes(existingValidatedValue.origin)
      ) {
        return;
      }

      // New value or undefined so just set
      if (!existingValidatedValue || validatedValue === undefined) {
        item[prop] = validatedValue as Types.CreateDataItemHelper[Prop];

        return;
      }

      // Update the props that need it so we can maintain references
      if (existingValidatedValue.origin !== validatedValue.origin) {
        existingValidatedValue.origin = validatedValue.origin;
      }

      if (existingValidatedValue.type !== validatedValue.type) {
        existingValidatedValue.type = validatedValue.type;
      }

      if (existingValidatedValue.value !== validatedValue.value) {
        existingValidatedValue.value = validatedValue.value;
      }
    }

    const validatedValue = props.validatedValue && {
      ...props.validatedValue,
      origin: props.origin,
    };

    if (canSetAsFallback) {
      setValue("fallbackValidatedValue", validatedValue);
    }

    if (canSetAsSaved) {
      setValue("savedValidatedValue", validatedValue);
    }

    setValue(
      "resolvedValidatedValue",
      // If we call this with undefined it means we want to use a fallback value if it exists
      validatedValue ?? item.fallbackValidatedValue,
    );

    // Add the item if it's new, otherwise the updates will apply to the draft so don't need to do
    // anything
    if (!existingItem) {
      draft.dataByCardDataId[side][props.cardDataId] = item as Types.DataItem;
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
      fieldType: undefined,
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
    if (props?.targetOrigin !== draft.targetOrigin) {
      draft.targetOrigin = props?.targetOrigin ?? null;
    }

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

    function addItem(addItemProps: {
      cardDataId: Cards.Id;
      validatedValue: Templates.ValidatedValue | undefined;
      fieldType: Templates.FieldType | undefined;
      origin: Types.ValueOrigin;
      side: Cards.Side | null;
    }) {
      safeIds.cardDataIds[addItemProps.cardDataId] = true;

      addItemRecipe(draft, addItemProps);
    }

    function addTemplateMapping(addTemplateMappingProps: {
      side: Cards.Side;
      templateDataId: Templates.DataId;
      cardDataId: Cards.DataId;
    }) {
      safeIds.cardDataIds[addTemplateMappingProps.cardDataId] = true;

      safeIds.templateDataIds[addTemplateMappingProps.side][
        addTemplateMappingProps.templateDataId
      ] = true;

      addTemplateMappingRecipe(draft, addTemplateMappingProps);
    }

    if (props?.cardData) {
      for (const cardDataId in props.cardData) {
        addItem({
          cardDataId,
          validatedValue: props.cardData[cardDataId],
          fieldType: undefined,
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
          fieldType: dataSchemaItem?.type ?? undefined,
          origin: "deck-defaults",
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
            fieldType: undefined,
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
            fieldType: schemaItem?.type ?? undefined,
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
