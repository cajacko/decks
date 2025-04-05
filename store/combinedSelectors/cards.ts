import { createCachedSelector } from "re-reselect";
import {
  selectCanEditDeck,
  selectDeck as selectDeckByDeckId,
} from "../selectors/decks";
import { selectTemplate } from "../selectors/templates";
import {
  selectCard,
  cardOrDeckKey,
  CardIdProps,
  DeckOrCardOptionalSideProps,
} from "../selectors/cards";
import { RootState, Decks, Cards } from "../types";
import { getIsCardId, Target } from "@/utils/cardTarget";
import {
  resolveCardData,
  TemplateValuesMap,
  ResolveCardDataProps,
} from "@/utils/resolveCardData";

export { cardOrDeckKey };

export type DeckOrCardSideProps = Target & { side: Cards.Side };

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
  (_: RootState, props: DeckOrCardOptionalSideProps) => props.id,
  (_: RootState, props: DeckOrCardOptionalSideProps) =>
    props.type === "deck-defaults" ? "deck-defaults" : "card",
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
    resetId,
    targetOrigin,
    cardData,
    deckDataSchema,
    frontSchema,
    frontDataTemplateMapping,
    backSchema,
    backDataTemplateMapping,
  ): ResolveCardDataProps => {
    return {
      resetId,
      targetOrigin,
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

export const selectCanEdit = (state: RootState, props: Target) => {
  if (getIsCardId(props)) {
    return selectCanEditCard(state, { cardId: props.id });
  }

  return selectCanEditDeck(state, { deckId: props.id });
};

export const selectCardSize = (state: RootState, props: Target) => {
  const deckSize = selectDeck(state, props)?.cardSize;

  if (props.type === "card") {
    return selectCard(state, { cardId: props.id })?.size ?? deckSize;
  }

  return deckSize;
};
