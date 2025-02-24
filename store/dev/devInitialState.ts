import { RootState, Templates, Tabletops } from "../types";
import templatesById from "@/config/templatesById";

const state: RootState = {
  cards: {
    cardsById: {
      card1: {
        cardId: "card1",
        deckId: "deck1",
        data: {
          title: {
            value: "Card 1",
            type: Templates.DataType.Text,
          },
          // description: {
          //   value: "This is card 1",
          //   type: Templates.DataType.Text,
          // },
        },
      },
      card2: {
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
    templatesById,
  },
  decks: {
    decksById: {
      deck1: {
        id: "deck1",
        dataSchemaOrder: ["title", "backgroundColor"],
        dataSchema: {
          title: {
            id: "title",
            title: "Title",
            type: Templates.DataType.Text,
          },
          // description: {
          //   id: "description",
          //   title: "Subtitle",
          //   type: Templates.DataType.Text,
          // },
          backgroundColor: {
            id: "backgroundColor",
            title: "Front Color",
            type: Templates.DataType.Color,
          },
        },
        name: "Deck 1",
        templates: {
          front: {
            templateId: templatesById.basicText.templateId,
            dataTemplateMapping: {
              "template1-title": {
                dataSchemaItemId: "title",
                templateSchemaItemId: "template1-title",
              },
              // "template1-description": {
              //   dataSchemaItemId: "description",
              //   templateSchemaItemId: "template1-description",
              // },
              "template1-backgroundColor": {
                dataSchemaItemId: "backgroundColor",
                templateSchemaItemId: "template1-backgroundColor",
              },
            },
          },
          back: {
            templateId: templatesById.plainBack.templateId,
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
      },
    },
  },
  tabletops: {
    tabletopsById: {
      tabletop1: {
        id: "tabletop1",
        stacksIds: ["stack1", "stack2", "stack3"],
        history: {
          past: [],
          present: {
            cardInstancesById: {
              cardInstance1: {
                cardInstanceId: "cardInstance1",
                cardId: "card1",
                state: Tabletops.CardInstanceState.faceUp,
              },
              cardInstance2: {
                cardInstanceId: "cardInstance2",
                cardId: "card2",
                state: Tabletops.CardInstanceState.faceUp,
              },
              cardInstance3: {
                cardInstanceId: "cardInstance3",
                cardId: "card3",
                state: Tabletops.CardInstanceState.faceUp,
              },
              cardInstance4: {
                cardInstanceId: "cardInstance4",
                cardId: "card4",
                state: Tabletops.CardInstanceState.faceUp,
              },
              cardInstance5: {
                cardInstanceId: "cardInstance5",
                cardId: "card5",
                state: Tabletops.CardInstanceState.faceUp,
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
              stack3: {
                id: "stack3",
                cardInstances: [],
              },
            },
            stacksIds: ["stack1", "stack2", "stack3"],
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
