import playingCards from "./playingCards";
import exampleDecks from "./exampleDecks";
import { ExampleDeck } from "./types";
import front, {
  dataIds as frontDataIds,
} from "@/constants/builtInTemplates/front";
import back, {
  dataIds as backDataIds,
} from "@/constants/builtInTemplates/back";

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

exampleDecks.forEach(
  ({
    description,
    key,
    title,
    cards,
    devOnly,
    color,
    backgroundColor,
    borderColor,
    textColor,
    backTextSize,
  }) => {
    const prebuiltDeck = prebuildDecks[key];

    if (prebuiltDeck) {
      map[key] = {
        ...prebuiltDeck,
        name: title,
        description,
        devOnly: !!devOnly,
        cards: cards ?? prebuiltDeck.cards,
      };

      return;
    }

    const deck: ExampleDeck = {
      name: title,
      description,
      devOnly: !!devOnly,
      cards: cards ?? [],
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

export default map;
