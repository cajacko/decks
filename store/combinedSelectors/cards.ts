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

      const getValidatedValue = (
        value: Templates.ValidatedValue | undefined,
      ): Templates.ValidatedValue | undefined => {
        if (!value) return undefined;

        if (value.type !== templateExpectedType) return undefined;

        return value;
      };

      const templateDefaultValue = schemaItem.defaultValidatedValue;

      let cardValue: Templates.ValidatedValue | undefined;
      let dataMappingDefaultValue: Templates.ValidatedValue | undefined;

      if (dataTemplateMapping) {
        const mapping = dataTemplateMapping[key];

        if (mapping) {
          dataMappingDefaultValue = mapping.defaultValidatedValue;

          const cardDataKey = mapping.dataSchemaItemId;

          cardValue = mergedCardData?.[cardDataKey];
        }
      }

      const validatedValue =
        getValidatedValue(cardValue) ??
        getValidatedValue(dataMappingDefaultValue) ??
        getValidatedValue(templateDefaultValue);

      data[key] = {
        ...schemaItem,
        validatedValue,
      };
    });

    return {
      data,
      markup,
    };
  },
)(cardKey);
