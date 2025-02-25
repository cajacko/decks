import { createCachedSelector } from "re-reselect";
import { selectCard } from "../slices/cards";
import { selectDeck } from "../slices/decks";
import { selectTemplate } from "../slices/templates";
import { RootState, Decks, Cards, Templates } from "../types";

type CardId = { cardId: string };
type CardIdSideProps = { cardId: string; side: Cards.Side };

const cardKey = (_: unknown, props: { cardId: string; side?: Cards.Side }) =>
  `${props.cardId}-${props.side ?? ""}`;

// Is a lookup, doesn't need to be cached
const selectDeckByCard = (
  state: RootState,
  props: CardId,
): Decks.Props | null => {
  const deckId = selectCard(state, props)?.deckId;

  if (!deckId) return null;

  return selectDeck(state, { deckId });
};

// Is a lookup, doesn't need to be cached
const selectCardSideTemplate = (
  state: RootState,
  props: CardIdSideProps,
): Cards.SideTemplate | null => {
  const card = selectCard(state, props);
  const deck = selectDeckByCard(state, props);

  const cardTemplate = card?.templates?.[props.side];

  if (cardTemplate) return cardTemplate;

  return deck?.templates?.[props.side] ?? null;
};

// Is a lookup, doesn't need to be cached
export const selectCardTemplate = (
  state: RootState,
  props: CardIdSideProps,
) => {
  const templateId = selectCardSideTemplate(state, props)?.templateId;

  return templateId ? selectTemplate(state, { templateId }) : null;
};

const selectMergedCardData = createCachedSelector(
  (state: RootState, props: CardId) => selectCard(state, props)?.data,
  (state: RootState, props: CardId) =>
    selectDeckByCard(state, props)?.dataSchema,
  (cardData, deckDataSchema): Cards.Data | null => {
    if (!cardData) return null;
    if (!deckDataSchema) return cardData;

    const combinedData = { ...cardData };

    Object.entries(deckDataSchema).forEach(([key, schemaItem]) => {
      const cardDataValue = combinedData[key];

      if (cardDataValue) return;

      const deckDataDefaultValue = schemaItem.defaultValidatedValue;

      if (!deckDataDefaultValue) return;

      combinedData[key] = deckDataDefaultValue;
    });

    return combinedData;
  },
)(cardKey);

export type LooseCardTemplateDataItem<
  T extends Templates.DataType = Templates.DataType,
  Id extends Templates.DataItemId = Templates.DataItemId,
> = Templates.LooseDataItem<T, Id> & {
  validatedValue: Templates.ValidatedValue<T> | null;
  cardDataItemId: Decks.DataSchemaItemId | null;
};

export type LooseCardTemplateData<
  T extends Templates.DataType = Templates.DataType,
  Id extends Templates.DataItemId = Templates.DataItemId,
> = {
  [K in Id]: LooseCardTemplateDataItem<T, K>;
};

export const selectCardTemplateData = createCachedSelector(
  (state: RootState, props: CardIdSideProps) =>
    selectCardTemplate(state, props)?.schema,
  (state: RootState, props: CardIdSideProps) =>
    selectCardSideTemplate(state, props)?.dataTemplateMapping,
  selectMergedCardData,
  (
    templateSchema,
    dataTemplateMapping,
    mergedCardData,
  ): null | LooseCardTemplateData => {
    if (!templateSchema) return null;

    const data: LooseCardTemplateData = {};

    Object.entries(templateSchema).forEach(([key, templateSchemaItem]) => {
      const templateExpectedType = templateSchemaItem.type;

      const getValidatedValue = (
        value: Templates.ValidatedValue | undefined,
      ): Templates.ValidatedValue | undefined => {
        if (!value) return undefined;

        if (value.type !== templateExpectedType) return undefined;

        return value;
      };

      const templateDefaultValue = templateSchemaItem.defaultValidatedValue;

      let cardValue: Templates.ValidatedValue | undefined;
      let dataMappingDefaultValue: Templates.ValidatedValue | undefined;
      let cardDataItemId: Decks.DataSchemaItemId | undefined;

      if (dataTemplateMapping) {
        const mapping = dataTemplateMapping[key];

        if (mapping) {
          dataMappingDefaultValue = mapping.defaultValidatedValue;

          cardDataItemId = mapping.dataSchemaItemId;

          cardValue = mergedCardData?.[cardDataItemId];
        }
      }

      const validatedValue =
        getValidatedValue(cardValue) ??
        getValidatedValue(dataMappingDefaultValue) ??
        getValidatedValue(templateDefaultValue) ??
        null;

      const dataItem: LooseCardTemplateDataItem = {
        ...templateSchemaItem,
        validatedValue,
        cardDataItemId: cardDataItemId ?? null,
      };

      data[key] = dataItem;
    });

    return data;
  },
)(cardKey);
