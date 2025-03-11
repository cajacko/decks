import { createCachedSelector } from "re-reselect";
import { selectCard } from "../slices/cards";
import { selectDeck as selectDeckByDeckId } from "../slices/decks";
import { selectTemplate } from "../slices/templates";
import { RootState, Decks, Cards } from "../types";
import { getIsCardId, Target } from "@/utils/cardTarget";
import {
  resolveCardData,
  TemplateValuesMap,
  ResolveCardDataProps,
} from "@/utils/resolveCardData";

type CardIdProps = { cardId: Cards.Id };
export type DeckOrCardSideProps = Target & { side: Cards.Side };
type DeckOrCardOptionalSideProps = Target & { side?: Cards.Side };

export const cardOrDeckKey = (
  _: unknown,
  props: DeckOrCardOptionalSideProps,
): string => `${props.type}:${props.id}-${props.side}`;

// Is a lookup, doesn't need to be cached
export const selectDeckByCard = (
  state: RootState,
  props: CardIdProps,
): Decks.Props | undefined => {
  const deckId = selectCard(state, props)?.deckId;

  if (!deckId) return undefined;

  return selectDeckByDeckId(state, { deckId });
};

export const selectDeck = (
  state: RootState,
  props: Target,
): Decks.Props | undefined => {
  if (getIsCardId(props)) {
    return selectDeckByCard(state, { cardId: props.id });
  }

  return selectDeckByDeckId(state, { deckId: props.id });
};

// Is a lookup, doesn't need to be cached
const selectCardSideTemplate = (
  state: RootState,
  props: DeckOrCardSideProps,
): Cards.SideTemplate | undefined => {
  if (getIsCardId(props)) {
    const card = selectCard(state, { cardId: props.id });
    const deck = selectDeckByCard(state, { cardId: props.id });

    const cardTemplate = card?.templates?.[props.side];

    if (cardTemplate) return cardTemplate;

    return deck?.templates?.[props.side];
  }

  return selectDeckByDeckId(state, { deckId: props.id })?.templates?.[
    props.side
  ];
};

// Is a lookup, doesn't need to be cached
export const selectCardTemplate = (
  state: RootState,
  props: DeckOrCardSideProps,
) => {
  const templateId = selectCardSideTemplate(state, props)?.templateId;

  return templateId ? selectTemplate(state, { templateId }) : undefined;
};

export const selectTemplateSchemaOrder = createCachedSelector(
  selectCardTemplate,
  (template) => {
    if (!template) return undefined;

    const schemaOrder = template.schemaOrder ?? [];

    // Add missing keys
    Object.keys(template.schema).forEach((key) => {
      if (!schemaOrder.includes(key)) {
        schemaOrder.push(key);
      }
    });

    return schemaOrder;
  },
)(cardOrDeckKey);

// export type LooseCardTemplateDataItem<
//   T extends Templates.FieldType = Templates.FieldType,
// > = Templates.DataItem<T> & {
//   validatedValue: Templates.ValidatedValue<T> | undefined;
//   cardDataItemId: Cards.DataId | null;
// };

// export type LooseCardTemplateData<
//   T extends Templates.FieldType = Templates.FieldType,
//   Id extends Templates.DataId = Templates.DataId,
// > = {
//   [K in Id]: LooseCardTemplateDataItem<T>;
// };

export const selectResolveCardDataProps = createCachedSelector(
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    getIsCardId(props) ? selectCard(state, { cardId: props.id })?.data : null,
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    selectDeck(state, props)?.dataSchema,
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    props.side === "back"
      ? null
      : selectCardTemplate(state, { ...props, side: "front" })?.schema,
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    props.side === "back"
      ? null
      : selectCardSideTemplate(state, { ...props, side: "front" })
          ?.dataTemplateMapping,
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    props.side === "front"
      ? null
      : selectCardTemplate(state, { ...props, side: "back" })?.schema,
  (state: RootState, props: DeckOrCardOptionalSideProps) =>
    props.side === "front"
      ? null
      : selectCardSideTemplate(state, { ...props, side: "back" })
          ?.dataTemplateMapping,
  (
    cardData,
    deckDataSchema,
    frontSchema,
    frontDataTemplateMapping,
    backSchema,
    backDataTemplateMapping,
  ): ResolveCardDataProps => {
    return {
      cardData: cardData ?? null,
      deckDataSchema: deckDataSchema ?? null,
      templates: {
        front: {
          dataTemplateMapping: frontDataTemplateMapping ?? null,
          schema: frontSchema ?? null,
        },
        back: {
          dataTemplateMapping: backDataTemplateMapping ?? null,
          schema: backSchema ?? null,
        },
      },
    };
  },
)(cardOrDeckKey);

export const selectCardTemplateData = createCachedSelector(
  selectResolveCardDataProps,
  (_, props: DeckOrCardSideProps) => props.side,
  (props, side): TemplateValuesMap | undefined => {
    return resolveCardData(props).resolvedDataValues[side];
  },
)(cardOrDeckKey);

export const selectCanEditCard = (state: RootState, props: CardIdProps) =>
  selectCard(state, props)?.canEdit ??
  selectDeckByCard(state, props)?.canEdit ??
  false;
