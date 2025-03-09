import { ExampleDeck } from "./types";
import playingCards from "@/constants/builtInTemplates/playingCards";
import back from "@/constants/builtInTemplates/back";

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
      dataTemplateMapping: {},
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
      },
      templateId: playingCards.templateId,
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
