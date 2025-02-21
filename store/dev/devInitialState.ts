import { RootState, CardInstanceState } from "../types";

const state: RootState = {
  cards: {
    cardsById: {
      card1: {
        cardId: "card1",
      },
      card2: {
        cardId: "card2",
      },
      card3: {
        cardId: "card3",
      },
      card4: {
        cardId: "card4",
      },
      card5: {
        cardId: "card5",
      },
    },
  },
  decks: {
    decksById: {
      deck1: {
        id: "deck1",
        // cardIds: ["card1", "card2", "card3", "card4", "card5"],
        deckCards: [
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
                state: CardInstanceState.faceUp,
              },
              cardInstance2: {
                cardInstanceId: "cardInstance2",
                cardId: "card2",
                state: CardInstanceState.faceUp,
              },
              cardInstance3: {
                cardInstanceId: "cardInstance3",
                cardId: "card3",
                state: CardInstanceState.faceUp,
              },
              cardInstance4: {
                cardInstanceId: "cardInstance4",
                cardId: "card4",
                state: CardInstanceState.faceUp,
              },
              cardInstance5: {
                cardInstanceId: "cardInstance5",
                cardId: "card5",
                state: CardInstanceState.faceUp,
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
