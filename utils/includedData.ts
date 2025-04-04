import playingCards from "@/constants/exampleDecks/playingCards";
import { ExampleDeck } from "@/constants/exampleDecks/types";
import front, {
  dataIds as frontDataIds,
} from "@/constants/builtInTemplates/front";
import back, {
  dataIds as backDataIds,
} from "@/constants/builtInTemplates/back";
import { IncludedData, FileData } from "@/constants/exampleDecks/includedData";
import { RootState, SliceName, Decks, Tabletops, Cards } from "@/store/types";
import { exampleDeckIds } from "@/utils/builtInTemplateIds";
import { getFlag } from "@/store/selectors/flags";
import { dateToDateString } from "./dates";

function includedDataToExampleDecks(
  _includedData: IncludedData,
): Record<string, ExampleDeck> {
  const includedData = _includedData as unknown as FileData;

  const prebuildDecks: Record<string, ExampleDeck | undefined> = {
    "playing-cards": playingCards,
  };

  const map: Record<string, ExampleDeck> = {};

  const dataIds = {
    title: "title",
    description: "description",
    emoji: "emoji",
    color: "color",
    backgroundColor: "backgroundColor",
    borderColor: "borderColor",
    textColor: "textColor",
    backText: "backText",
    backTextSize: "backTextSize",
  };

  includedData.forEach(
    ({
      data: cards,
      props: {
        description,
        key,
        title,
        devOnly,
        color,
        backgroundColor,
        borderColor,
        textColor,
        backTextSize,
        sortOrder: _sortOrder,
        version = null,
      },
    }) => {
      const prebuiltDeck = prebuildDecks[key];
      const sortOrderNumber = _sortOrder ? parseInt(_sortOrder) : null;
      const sortOrder =
        sortOrderNumber !== null && !isNaN(sortOrderNumber)
          ? sortOrderNumber
          : null;

      if (prebuiltDeck) {
        map[key] = {
          ...prebuiltDeck,
          version,
          name: title,
          description,
          devOnly: !!devOnly,
          cards: cards ?? prebuiltDeck.cards,
          sortOrder,
        };

        return;
      }

      const deck: ExampleDeck = {
        name: title,
        version,
        description,
        devOnly: !!devOnly,
        cards: cards ?? [],
        sortOrder,
        templates: {
          back: {
            templateId: back.templateId,
            dataTemplateMapping: {
              [backDataIds.text]: {
                dataId: dataIds.backText,
                templateDataId: backDataIds.text,
              },
              [backDataIds.color]: {
                dataId: dataIds.color,
                templateDataId: backDataIds.color,
              },
              [backDataIds.textColor]: {
                dataId: dataIds.textColor,
                templateDataId: backDataIds.textColor,
              },
              [backDataIds.backgroundColor]: {
                dataId: dataIds.backgroundColor,
                templateDataId: backDataIds.backgroundColor,
              },
              [backDataIds.textSize]: {
                dataId: dataIds.backTextSize,
                templateDataId: backDataIds.textSize,
              },
            },
          },
          front: {
            dataTemplateMapping: {
              [frontDataIds.title]: {
                dataId: dataIds.title,
                templateDataId: frontDataIds.title,
              },
              [frontDataIds.description]: {
                dataId: dataIds.description,
                templateDataId: frontDataIds.description,
              },
              [frontDataIds.emoji]: {
                dataId: dataIds.emoji,
                templateDataId: frontDataIds.emoji,
              },
              [frontDataIds.color]: {
                dataId: dataIds.color,
                templateDataId: frontDataIds.color,
              },
              [frontDataIds.backgroundColor]: {
                dataId: dataIds.backgroundColor,
                templateDataId: frontDataIds.backgroundColor,
              },
              [frontDataIds.borderColor]: {
                dataId: dataIds.borderColor,
                templateDataId: frontDataIds.borderColor,
              },
              [frontDataIds.descriptionColor]: {
                dataId: dataIds.textColor,
                templateDataId: frontDataIds.descriptionColor,
              },
              [frontDataIds.titleColor]: {
                dataId: dataIds.textColor,
                templateDataId: frontDataIds.titleColor,
              },
            },
            templateId: front.templateId,
          },
        },
        dataSchema: {
          [dataIds.title]: {
            id: dataIds.title,
            type: "text",
            defaultValidatedValue: {
              type: "null",
              value: null,
            },
          },
          [dataIds.emoji]: {
            id: dataIds.emoji,
            type: "text",
            defaultValidatedValue: {
              type: "null",
              value: null,
            },
          },
          [dataIds.description]: {
            id: dataIds.description,
            type: "text",
            defaultValidatedValue: {
              type: "null",
              value: null,
            },
          },
          [dataIds.backText]: {
            id: dataIds.backText,
            type: "text",
          },
          [dataIds.color]: {
            id: dataIds.color,
            type: "color",
            defaultValidatedValue: color
              ? {
                  type: "color",
                  value: color,
                }
              : undefined,
          },
          [dataIds.backgroundColor]: {
            id: dataIds.backgroundColor,
            type: "color",
            defaultValidatedValue: backgroundColor
              ? {
                  type: "color",
                  value: backgroundColor,
                }
              : undefined,
          },
          [dataIds.borderColor]: {
            id: dataIds.borderColor,
            type: "color",
            defaultValidatedValue: borderColor
              ? {
                  type: "color",
                  value: borderColor,
                }
              : undefined,
          },
          [dataIds.textColor]: {
            id: dataIds.textColor,
            type: "color",
            defaultValidatedValue: textColor
              ? {
                  type: "color",
                  value: textColor,
                }
              : undefined,
          },
          [dataIds.backTextSize]: {
            id: dataIds.backTextSize,
            type: "text",
            defaultValidatedValue: backTextSize
              ? {
                  type: "text",
                  value: backTextSize,
                }
              : undefined,
          },
        },
      };

      map[key] = deck;
    },
  );

  return map;
}

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

export function includedDataToRootState(
  _includedData: IncludedData,
): Partial<RootState> {
  const exampleDecks = includedDataToExampleDecks(_includedData);

  const state: State = {
    decks: {
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
    const isDev = getFlag("DEV_MODE") === true;

    if (exampleDeck.devOnly && !isDev) return;

    const ids = exampleDeckIds(deckKey);

    const deckId = ids.deckId;
    const tabletopId = ids.tabletopId;
    const stack1Id = ids.stackId("1");
    const stack2Id = ids.stackId("2");
    const dateCreated = dateToDateString(new Date());
    const dateUpdated = dateCreated;

    const dataSchema = exampleDeck.dataSchema ?? {};

    const deck: Decks.Props = {
      version: exampleDeck.version ?? undefined,
      id: deckId,
      name: exampleDeck.name,
      description: exampleDeck.description,
      cards: [],
      cardSize: Cards.Size.Poker,
      dataSchema,
      dataSchemaOrder: Object.keys(dataSchema),
      defaultTabletopId: tabletopId,
      canEdit: false,
      templates: exampleDeck.templates,
      dateCreated,
      dateUpdated,
      dateDeleted: null,
      sortOrder: exampleDeck.sortOrder ?? undefined,
    };

    const tabletop: Tabletops.Props = {
      id: tabletopId,
      availableDecks: [deckId],
      settings: exampleDeck.tabletopSettings,
      missingCardIds: [],
      dateCreated,
      dateUpdated,
      dateDeleted: null,
      history: {
        future: [],
        past: [],
        present: {
          operation: { type: "INIT", payload: null },
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
      if (cardProps.devOnly && !isDev) return;

      const cardId = ids.cardId(`${index + 1}`);
      const cardInstanceId = ids.cardInstanceId(cardId);

      const card: Cards.Props = {
        dateCreated,
        dateUpdated,
        dateDeleted: null,
        size: null,
        cardId,
        canEdit: false,
        deckId,
        data: {},
      };

      Object.entries(cardProps).forEach(([dataId, value]) => {
        card.data[dataId] = getValidatedValueType(value);

        deck.templates.front.dataTemplateMapping[dataId] = {
          dataId: dataId,
          templateDataId: front.schema.title.id,
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
    state.tabletops.tabletopsById[tabletopId] = tabletop;
  });

  return state;
}
