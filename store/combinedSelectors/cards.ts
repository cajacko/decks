import { createCachedSelector } from "re-reselect";
import { selectCard } from "../slices/cards";
import { selectDeck } from "../slices/decks";
import { selectTemplate } from "../slices/templates";
import { RootState, Decks, Cards, Templates } from "../types";
import { getIsCardId, Target } from "@/utils/cardTarget";

type CardIdProps = { cardId: string };

export type DeckOrCardSideProps = Target & { side: Cards.Side };

const cardOrDeckKey = (_: unknown, props: DeckOrCardSideProps): string =>
  `${props.type}:${props.id}-${props.side}`;

// Is a lookup, doesn't need to be cached
const selectDeckByCard = (
  state: RootState,
  props: CardIdProps,
): Decks.Props | null => {
  const deckId = selectCard(state, props)?.deckId;

  if (!deckId) return null;

  return selectDeck(state, { deckId });
};

// Is a lookup, doesn't need to be cached
const selectCardSideTemplate = (
  state: RootState,
  props: DeckOrCardSideProps,
): Cards.SideTemplate | null => {
  if (getIsCardId(props)) {
    const card = selectCard(state, { cardId: props.id });
    const deck = selectDeckByCard(state, { cardId: props.id });

    const cardTemplate = card?.templates?.[props.side];

    if (cardTemplate) return cardTemplate;

    return deck?.templates?.[props.side] ?? null;
  }

  return (
    selectDeck(state, { deckId: props.id })?.templates?.[props.side] ?? null
  );
};

// Is a lookup, doesn't need to be cached
export const selectCardTemplate = (
  state: RootState,
  props: DeckOrCardSideProps,
) => {
  const templateId = selectCardSideTemplate(state, props)?.templateId;

  return templateId ? selectTemplate(state, { templateId }) : null;
};

/**
 * Selects the data for a card by merging the card data with the deck defaults.
 * If a cardId is passed we merge the data with the deck defaults
 * If a deckId is passed we just return the deck defaults (useful for creating new cards)
 *
 * NOTE: This does not merge in any defaults from the templates and doesn't have any awareness of
 * templates at this time
 */
const selectMergedCardData = createCachedSelector(
  (state: RootState, props: DeckOrCardSideProps) =>
    getIsCardId(props) ? selectCard(state, { cardId: props.id })?.data : null,
  (state: RootState, props: DeckOrCardSideProps) =>
    getIsCardId(props)
      ? selectDeckByCard(state, { cardId: props.id })?.dataSchema
      : selectDeck(state, { deckId: props.id })?.dataSchema,
  (cardData, deckDataSchema): Cards.Data | null => {
    // If there's no deck schema then there's no defaults to find, so just return the card data or null
    if (!deckDataSchema) return cardData ?? null;

    // Now we merge the deck defaults into the missing entries from the card data
    const combinedData: Cards.Data = { ...cardData };

    Object.entries(deckDataSchema).forEach(([key, schemaItem]) => {
      const cardDataValue = combinedData[key];

      if (cardDataValue) return;

      const deckDataDefaultValue = schemaItem.defaultValidatedValue;

      if (!deckDataDefaultValue) return;

      combinedData[key] = deckDataDefaultValue;
    });

    return combinedData;
  },
)(cardOrDeckKey);

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
  (state: RootState, props: DeckOrCardSideProps) =>
    selectCardTemplate(state, props)?.schema,
  (state: RootState, props: DeckOrCardSideProps) =>
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
)(cardOrDeckKey);
