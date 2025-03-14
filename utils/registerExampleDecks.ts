import exampleDecks from "@/constants/exampleDecks";
import { RootState, SliceName, Decks, Tabletops, Cards } from "@/store/types";
import builtInTemplates from "@/constants/builtInTemplates";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import { registerBuiltInState } from "@/store/utils/withBuiltInState";

type State = Pick<
  RootState,
  SliceName.Decks | SliceName.Cards | SliceName.Tabletops
>;

function getValidatedValueType(
  value: string | boolean | null,
): Cards.Data[string] {
  let data: Cards.Data[string];

  // TODO: Validate the card types here.
  switch (typeof value) {
    case "string":
      data = {
        value: value,
        type: "text",
      };
      break;
    case "boolean":
      data = {
        value: value,
        type: "boolean",
      };
      break;
    default:
      if (value === null) {
        data = {
          type: "null",
          value: null,
        };
      }
  }

  return data;
}

export default function registerExampleDecks() {
  const state: State = {
    decks: {
      deckIds: [],
      decksById: {},
    },
    tabletops: {
      tabletopsById: {},
    },
    cards: {
      cardsById: {},
    },
  };

  Object.entries(exampleDecks).forEach(([deckKey, exampleDeck]) => {
    const ids = exampleDeckIds(deckKey);

    const deckId = ids.deckId;
    const tabletopId = ids.tabletopId;
    const stack1Id = ids.stackId("1");
    const stack2Id = ids.stackId("2");

    const dataSchema = exampleDeck.dataSchema ?? {};

    const deck: Decks.Props = {
      id: deckId,
      name: exampleDeck.name,
      description: exampleDeck.description,
      cards: [],
      cardSize: Cards.Size.Poker,
      dataSchema,
      dataSchemaOrder: Object.keys(dataSchema),
      defaultTabletopId: tabletopId,
      status: "active",
      canEdit: false,
      templates: exampleDeck.templates,
    };

    const tabletop: Tabletops.Props = {
      id: tabletopId,
      availableDecks: [deckId],
      history: {
        future: [],
        past: [],
        present: {
          cardInstancesById: {},
          stacksById: {
            [stack1Id]: {
              id: stack1Id,
              cardInstances: [],
            },
            [stack2Id]: {
              id: stack2Id,
              cardInstances: [],
            },
          },
          stacksIds: [stack1Id, stack2Id],
        },
      },
    };

    exampleDeck.cards.forEach((cardProps, index) => {
      const cardId = ids.cardId(`${index + 1}`);
      const cardInstanceId = ids.cardInstanceId(cardId);

      const card: Cards.Props = {
        cardId,
        canEdit: false,
        deckId,
        data: {},
        status: "active",
      };

      Object.entries(cardProps).forEach(([dataId, value]) => {
        card.data[dataId] = getValidatedValueType(value);

        deck.templates.front.dataTemplateMapping[dataId] = {
          dataId: dataId,
          templateDataId: builtInTemplates.front.schema.title.id,
        };
      });

      deck.cards.push({
        cardId,
        quantity: 1,
      });

      state.cards.cardsById[cardId] = card;

      const cardInstance: Tabletops.CardInstance = {
        cardInstanceId,
        cardId,
        side: "front",
      };

      tabletop.history.present.cardInstancesById[cardInstanceId] = cardInstance;

      tabletop.history.present.stacksById[stack1Id]?.cardInstances.push(
        cardInstanceId,
      );
    });

    state.decks.decksById[deckId] = deck;
    state.decks.deckIds.push(deckId);
    state.tabletops.tabletopsById[tabletopId] = tabletop;
  });

  registerBuiltInState(state);

  return state;
}
