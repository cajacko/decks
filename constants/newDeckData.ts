import { Cards } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import builtInTemplates, { back } from "@/constants/builtInTemplates";
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
  canEdit: false,
  data: {
    [dataSchemaIds.title]: {
      type: "text",
      value: text["decks_screen.my_decks.new"],
    },
    [dataSchemaIds.color]: {
      type: "color",
      value: fixed.cardPresets.newDeck,
    },
  },
  deckId: null,
  status: "active",
  templates: {
    front: {
      dataTemplateMapping: {
        [builtInTemplates.front.schema.title.id]: {
          dataId: dataSchemaIds.title,
          templateDataId: builtInTemplates.front.schema.title.id,
        },
        [builtInTemplates.front.schema.color.id]: {
          dataId: dataSchemaIds.color,
          templateDataId: builtInTemplates.front.schema.color.id,
        },
      },
      templateId: builtInTemplates.front.templateId,
    },
    back: {
      dataTemplateMapping: {
        [builtInTemplates.back.schema[back.dataIds.text].id]: {
          dataId: dataSchemaIds.title,
          templateDataId: builtInTemplates.back.schema[back.dataIds.text].id,
        },
        [builtInTemplates.back.schema.color.id]: {
          dataId: dataSchemaIds.color,
          templateDataId: builtInTemplates.back.schema.color.id,
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
