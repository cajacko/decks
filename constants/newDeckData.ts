import { Cards, Templates } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import builtInTemplates from "@/constants/builtInTemplates";
import { registerBuiltInState } from "@/store/utils/withBuiltInState";
import text from "./text";
import { fixed } from "./colors";

/**
 * Data for displaying a new deck creation card.
 */

export const newDeckCardTarget: Target = {
  id: "new-deck-card",
  type: "card",
};

const dataSchemaIds = {
  title: "title",
  color: "color",
};

export const newDeckCard: Cards.Props = {
  cardId: newDeckCardTarget.id,
  data: {
    [dataSchemaIds.title]: {
      type: Templates.DataType.Text,
      value: text["decks_screen.my_decks.new"],
    },
    [dataSchemaIds.color]: {
      type: Templates.DataType.Color,
      value: fixed.cardPresets.newDeck,
    },
  },
  deckId: null,
  status: "active",
  templates: {
    front: {
      dataTemplateMapping: {
        [builtInTemplates.front.schema.title.id]: {
          dataSchemaItemId: dataSchemaIds.title,
          templateSchemaItemId: builtInTemplates.front.schema.title.id,
        },
        [builtInTemplates.front.schema.color.id]: {
          dataSchemaItemId: dataSchemaIds.color,
          templateSchemaItemId: builtInTemplates.front.schema.color.id,
        },
      },
      templateId: builtInTemplates.front.templateId,
    },
    back: {
      dataTemplateMapping: {
        [builtInTemplates.back.schema.text.id]: {
          dataSchemaItemId: dataSchemaIds.title,
          templateSchemaItemId: builtInTemplates.back.schema.text.id,
        },
        [builtInTemplates.back.schema.color.id]: {
          dataSchemaItemId: dataSchemaIds.color,
          templateSchemaItemId: builtInTemplates.back.schema.color.id,
        },
      },
      templateId: builtInTemplates.back.templateId,
    },
  },
};

registerBuiltInState({
  cards: {
    cardsById: {
      [newDeckCard.cardId]: newDeckCard,
    },
  },
});
