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

type State = Pick<
  RootState,
  SliceName.Decks | SliceName.Cards | SliceName.Tabletops
>;

let cache: State | null = null;

export default function exampleDecksToStore() {
  if (cache) {
    return cache;
  }

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

    const deck: Decks.Props = {
      id: deckId,
      name: exampleDeck.name,
      description: exampleDeck.description,
      cards: [],
      cardSize: Decks.CardSize.Poker,
      dataSchema: {},
      dataSchemaOrder: [],
      defaultTabletopId: tabletopId,
      status: "active",
      templates: {
        back: {
          dataTemplateMapping: {},
          templateId: builtInTemplates.back.templateId,
        },
        front: {
          dataTemplateMapping: {},
          templateId: builtInTemplates.front.templateId,
        },
      },
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

    exampleDeck.cards.forEach(({ title, description }, index) => {
      const cardId = ids.cardId(`${index + 1}`);
      const cardInstanceId = ids.cardInstanceId(cardId);
      const titleId = "title";
      const descriptionId = "description";

      const card: Cards.Props = {
        cardId,
        deckId,
        data: {},
        status: "active",
      };

      if (title) {
        card.data[titleId] = {
          value: title,
          type: Templates.DataType.Text,
        };

        deck.templates.front.dataTemplateMapping[titleId] = {
          dataSchemaItemId: titleId,
          templateSchemaItemId: builtInTemplates.front.schema.title.id,
        };
      }

      if (description) {
        card.data[descriptionId] = {
          value: description,
          type: Templates.DataType.Text,
        };

        deck.templates.front.dataTemplateMapping[descriptionId] = {
          dataSchemaItemId: descriptionId,
          templateSchemaItemId: builtInTemplates.front.schema.description.id,
        };
      }

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

  cache = state;

  return state;
}
