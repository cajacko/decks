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

      const deckDataDefaultValue = schemaItem.defaultValue;

      if (!deckDataDefaultValue) return;

      combinedData[key] = deckDataDefaultValue;
    });

    return combinedData;
  },
)(cardKey);

type CardTemplate<Props extends Templates.Props = Templates.Props> = {
  data: Props["schema"];
  markup: Props["markup"];
};

export const selectCardTemplateData = createCachedSelector(
  (state: RootState, props: CardIdSideProps) =>
    selectCardTemplate(state, props)?.markup,
  (state: RootState, props: CardIdSideProps) =>
    selectCardTemplate(state, props)?.schema,
  (state: RootState, props: CardIdSideProps) =>
    selectCardSideTemplate(state, props)?.dataTemplateMapping,
  selectMergedCardData,
  (
    markup,
    schema,
    dataTemplateMapping,
    mergedCardData,
  ): null | CardTemplate => {
    if (!markup || !schema) return null;

    const data: Templates.Data = {};

    Object.entries(schema).forEach(([key, schemaItem]) => {
      const templateExpectedType = schemaItem.type;

      const getValidValue = (
        value: Templates.DataValue | undefined,
      ): Templates.DataValue | undefined => {
        if (!value) return undefined;

        if (value.type !== templateExpectedType) return undefined;

        return value;
      };

      const templateDefaultValue = schemaItem.defaultValue;

      let cardValue: Templates.DataValue | undefined;
      let dataMappingDefaultValue: Templates.DataValue | undefined;

      if (dataTemplateMapping) {
        const mapping = dataTemplateMapping[key];

        if (mapping) {
          dataMappingDefaultValue = mapping.defaultValue;

          const cardDataKey = mapping.dataSchemaItemId;

          cardValue = mergedCardData?.[cardDataKey];
        }
      }

      const value =
        getValidValue(cardValue) ??
        getValidValue(dataMappingDefaultValue) ??
        getValidValue(templateDefaultValue);

      // FIXME:
      // @ts-ignore
      data[key] = {
        ...schemaItem,
        value,
      };
    });

    return {
      data,
      markup,
    };
  },
)(cardKey);
