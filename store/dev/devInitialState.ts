import { RootState, Templates, Decks } from "../types";
import exampleDecksToStore from "@/utils/exampleDecksToStore";
import builtInTemplates from "@/constants/builtInTemplates";

const exampleState = exampleDecksToStore();

const state: RootState = {
  cards: {
    cardsById: {
      ...exampleState.cards.cardsById,
      card1: {
        status: "active",
        cardId: "card1",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 1",
            type: Templates.DataType.Text,
          },
        },
      },
      card2: {
        status: "active",
        cardId: "card2",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 2 (no description)",
            type: Templates.DataType.Text,
          },
        },
      },
      card3: {
        status: "active",
        cardId: "card3",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 3",
            type: Templates.DataType.Text,
          },
          // description: {
          //   value: "Blue background",
          //   type: Templates.DataType.Text,
          // },
          backgroundColor: {
            value: "blue",
            type: Templates.DataType.Color,
          },
        },
      },
      card4: {
        status: "active",
        cardId: "card4",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 4",
            type: Templates.DataType.Text,
          },
          // description: {
          //   value: "This is card 4",
          //   type: Templates.DataType.Text,
          // },
        },
      },
      card5: {
        status: "active",
        cardId: "card5",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 5",
            type: Templates.DataType.Text,
          },
          // description: {
          //   value: "This is card 5",
          //   type: Templates.DataType.Text,
          // },
        },
      },
    },
  },
  templates: {
    templatesById: {},
  },
  decks: {
    decksById: {
      ...exampleState.decks.decksById,
      deck1: {
        cardSize: Decks.CardSize.Poker,
        status: "active",
        id: "deck1",
        dataSchemaOrder: ["title", "backgroundColor"],
        dataSchema: {
          title: {
            id: "title",
            type: Templates.DataType.Text,
          },
          // description: {
          //   id: "description",
          //   title: "Subtitle",
          //   type: Templates.DataType.Text,
          // },
          backgroundColor: {
            id: "backgroundColor",
            type: Templates.DataType.Color,
          },
        },
        name: "Deck 1",
        templates: {
          front: {
            templateId: builtInTemplates.front.templateId,
            dataTemplateMapping: {
              [builtInTemplates.front.schema.title.id]: {
                dataSchemaItemId: "title",
                templateSchemaItemId: builtInTemplates.front.schema.title.id,
              },
              [builtInTemplates.front.schema.backgroundColor.id]: {
                dataSchemaItemId: "backgroundColor",
                templateSchemaItemId:
                  builtInTemplates.front.schema.backgroundColor.id,
              },
            },
          },
          back: {
            templateId: builtInTemplates.back.templateId,
            dataTemplateMapping: {},
          },
        },
        description: "This is a deck",
        cards: [
          {
            cardId: "card1",
            quantity: 1,
          },
          {
            cardId: "card2",
            quantity: 1,
          },
          {
            cardId: "card3",
            quantity: 1,
          },
          {
            cardId: "card4",
            quantity: 1,
          },
          {
            cardId: "card5",
            quantity: 1,
          },
        ],
        defaultTabletopId: "tabletop1",
      },
    },
    deckIds: ["deck1", ...exampleState.decks.deckIds],
  },
  tabletops: {
    tabletopsById: {
      ...exampleState.tabletops.tabletopsById,
      tabletop1: {
        id: "tabletop1",
        availableDecks: ["deck1"],
        history: {
          past: [],
          present: {
            cardInstancesById: {
              cardInstance1: {
                cardInstanceId: "cardInstance1",
                cardId: "card1",
                side: "front",
              },
              cardInstance2: {
                cardInstanceId: "cardInstance2",
                cardId: "card2",
                side: "front",
              },
              cardInstance3: {
                cardInstanceId: "cardInstance3",
                cardId: "card3",
                side: "front",
              },
              cardInstance4: {
                cardInstanceId: "cardInstance4",
                cardId: "card4",
                side: "front",
              },
              cardInstance5: {
                cardInstanceId: "cardInstance5",
                cardId: "card5",
                side: "front",
              },
            },
            stacksById: {
              stack1: {
                id: "stack1",
                cardInstances: [
                  "cardInstance1",
                  "cardInstance2",
                  "cardInstance3",
                  "cardInstance4",
                  "cardInstance5",
                ],
              },
              stack2: {
                id: "stack2",
                cardInstances: [],
              },
            },
            stacksIds: ["stack1", "stack2"],
          },
          future: [],
        },
      },
    },
  },
  userSettings: {
    animateCardMovement: true,
    holdMenuBehaviour: "hold",
  },
};

export default state;
