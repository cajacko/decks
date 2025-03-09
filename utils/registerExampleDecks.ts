import exampleDecks from "@/constants/exampleDecks";
import {
  RootState,
  SliceName,
  Decks,
  Tabletops,
  Cards,
  Templates,
} from "@/store/types";
import builtInTemplates from "@/constants/builtInTemplates";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import { registerBuiltInState } from "@/store/utils/withBuiltInState";

type State = Pick<
  RootState,
  SliceName.Decks | SliceName.Cards | SliceName.Tabletops
>;

function getValidatedDataType(
  value: string | boolean | null,
): Cards.Data[string] {
  let data: Cards.Data[string];

  // TODO: Validate the card types here.
  switch (typeof value) {
    case "string":
      data = {
        value: value,
        type: Templates.DataType.Text,
      };
      break;
    case "boolean":
      data = {
        value: value,
        type: Templates.DataType.Boolean,
      };
      break;
    default:
      if (value === null) {
        data = {
          type: Templates.DataType.Null,
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
      cardSize: Decks.CardSize.Poker,
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

      Object.entries(cardProps).forEach(([dataSchemaId, value]) => {
        card.data[dataSchemaId] = getValidatedDataType(value);

        deck.templates.front.dataTemplateMapping[dataSchemaId] = {
          dataSchemaItemId: dataSchemaId,
          templateSchemaItemId: builtInTemplates.front.schema.title.id,
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
