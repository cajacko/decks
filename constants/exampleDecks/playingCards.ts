import { ExampleDeck } from "./types";
import playingCards, {
  dataIds as templateDataIds,
} from "@/constants/builtInTemplates/playingCards";
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

const dataIds = {
  suit: "suit",
  value: "value",
  color: "color",
};

const deck: ExampleDeck<
  Record<typeof dataIds.suit | typeof dataIds.value, string>
> = {
  name: "Playing Cards",
  description: "A standard deck of 52 playing cards",
  templates: {
    back: {
      templateId: back.templateId,
      dataTemplateMapping: {
        [templateDataIds.color]: {
          dataId: dataIds.color,
          templateDataId: back.schema.color.id,
        },
      },
    },
    front: {
      dataTemplateMapping: {
        [templateDataIds.suit]: {
          dataId: dataIds.suit,
          templateDataId: templateDataIds.suit,
        },
        [templateDataIds.value]: {
          dataId: dataIds.value,
          templateDataId: templateDataIds.value,
        },
        [templateDataIds.color]: {
          dataId: dataIds.color,
          templateDataId: templateDataIds.color,
        },
      },
      templateId: playingCards.templateId,
    },
  },
  dataSchema: {
    [dataIds.suit]: {
      id: dataIds.suit,
      type: "text",
    },
    [dataIds.value]: {
      id: dataIds.value,
      type: "text",
    },
    [dataIds.color]: {
      id: dataIds.color,
      type: "color",
      defaultValidatedValue: {
        type: "color",
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
