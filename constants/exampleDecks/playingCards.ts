import { ExampleDeck } from "./types";
import playingCards from "@/constants/builtInTemplates/playingCards";
import back from "@/constants/builtInTemplates/back";
import { Templates } from "@/store/types";

const suits = [{ name: "❤️" }, { name: "♦️" }, { name: "♣️" }, { name: "♠️" }];

const values = [
  { value: "A", count: 1 },
  { value: "2", count: 2 },
  { value: "3", count: 3 },
  { value: "4", count: 4 },
  { value: "5", count: 5 },
  { value: "6", count: 6 },
  { value: "7", count: 7 },
  { value: "8", count: 8 },
  { value: "9", count: 9 },
  { value: "10", count: 10 },
];

const deck: ExampleDeck<{
  suit: string;
  value: string;
}> = {
  name: "Playing Cards",
  description: "A standard deck of 52 playing cards",
  templates: {
    back: {
      templateId: back.templateId,
      dataTemplateMapping: {
        color: {
          dataSchemaItemId: "color",
          templateSchemaItemId: back.schema.color.id,
        },
      },
    },
    front: {
      dataTemplateMapping: {
        suit: {
          dataSchemaItemId: "suit",
          templateSchemaItemId: playingCards.schema.suit.id,
        },
        value: {
          dataSchemaItemId: "value",
          templateSchemaItemId: playingCards.schema.value.id,
        },
        color: {
          dataSchemaItemId: "color",
          templateSchemaItemId: playingCards.schema.color.id,
        },
      },
      templateId: playingCards.templateId,
    },
  },
  dataSchema: {
    color: {
      id: "color",
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        type: Templates.DataType.Color,
        value: "#D4F6FF",
      },
    },
  },
  cards: [],
};

suits.forEach((suit) => {
  values.forEach(({ value, count }) => {
    deck.cards.push({
      suit: suit.name,
      value,
    });
  });

  // Face cards (J, Q, K)
  ["J", "Q", "K"].forEach((face) => {
    deck.cards.push({
      suit: suit.name,
      value: face,
    });
  });
});

export default deck;
