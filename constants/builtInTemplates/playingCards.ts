import { Templates, Markup } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";
import {
  ReservedDataSchemaIds,
  reservedDataSchemaItems,
} from "@/constants/reservedDataSchemaItems";
import { colorFunction } from "@/components/templates/handlebars";
import { dateToDateString } from "@/utils/dates";

// NOTE: Do not change these ID's as people's existing mappings will break
const { templateId, dataItemId } = builtInTemplateIds("playing-cards");

export const dataIds = {
  suit: dataItemId("suit"),
  value: dataItemId("value"),
  color: ReservedDataSchemaIds.Color,
} as const;

type DataId = (typeof dataIds)[keyof typeof dataIds];

const mainSuitSize = 10;
const faceCardOffset = 2;
const iconOpacity = 0.75;

const corner: Markup.Nodes = [
  {
    type: "View",
    style: {
      justifyContent: "center",
      alignItems: "center",
      padding: 1,
    },
    children: [
      {
        type: "Text",
        text: `{{${dataIds.value}}}`,
        style: {
          fontSize: 8,
          textAlign: "center",
          color: colorFunction("lightness", dataIds.color, 30),
        },
      },
      {
        type: "Text",
        text: `{{${dataIds.suit}}}`,
        conditional: dataIds.suit,
        style: {
          fontSize: 6,
          textAlign: "center",
          opacity: iconOpacity,
        },
      },
    ],
  },
];

function singleIcon(value: string): Markup.Nodes {
  let text: string;

  switch (value.toLowerCase().trim()) {
    case "a":
      text = `{{${dataIds.suit}}}`;
      break;
    case "j":
      text = "👨";
      break;
    case "q":
      text = "👸";
      break;
    case "k":
      text = "🤴";
      break;
    default:
      return [];
  }

  return [
    {
      type: "View",
      conditional: `{{equals ${dataIds.value} "${value}"}}`,
      style: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colorFunction("lightness", dataIds.color, 30),
        borderWidth: 0.5,
      },
      children: [
        {
          type: "Text",
          text: `{{${dataIds.suit}}}`,
          style: {
            fontSize: mainSuitSize,
            position: "absolute",
            top: faceCardOffset,
            left: faceCardOffset,
          },
        },
        {
          type: "Text",
          text,
          style: {
            fontSize: 30,
          },
        },
        {
          type: "Text",
          text: `{{${dataIds.suit}}}`,
          style: {
            fontSize: mainSuitSize,
            transform: [{ rotate: "180deg" }],
            position: "absolute",
            bottom: faceCardOffset,
            right: faceCardOffset,
          },
        },
      ],
    },
  ];
}

const numberPatterns = [
  [[true]],
  [[true, true]],
  [[true, true, true]],
  [
    [true, true],
    [true, true],
  ],
  [[true, true], [true], [true, true]],
  [
    [true, true, true],
    [true, true, true],
  ],
  [
    [true, true, true],
    [false, true],
    [true, true, true],
  ],
  [
    [true, true, true],
    [true, true],
    [true, true, true],
  ],
  [[true, true, true, true], [true], [true, true, true, true]],
  [
    [true, true, true, true],
    [true, true],
    [true, true, true, true],
  ],
];

function repeatSuit(count: number): Markup.Nodes {
  const numberPattern = numberPatterns[count - 1];

  if (!numberPattern) return [];

  const columns: Markup.Nodes = [];

  numberPattern.forEach((column, i) => {
    const isFirstColumn = i === 0;
    const isLastColumn = i === numberPattern.length - 1;
    const rows: Markup.Nodes = [];

    column.forEach((hasSuitIcon, i) => {
      // If the row is in the bottom half of rows (middle counts as top), flip the suit icon
      const shouldFlip = i >= Math.ceil(column.length / 2);

      rows.push({
        type: "Text",
        text: hasSuitIcon ? `{{${dataIds.suit}}}` : "",
        style: {
          fontSize: mainSuitSize,
          textAlign: "center",
          transform: shouldFlip ? [{ rotate: "180deg" }] : "none",
        },
      });
    });

    columns.push({
      type: "View",
      style: {
        flexDirection: "column",
        justifyContent:
          (!isFirstColumn && !isLastColumn) || rows.length === 1
            ? "space-evenly"
            : "space-between",
      },
      children: rows,
    });
  });

  return [
    {
      type: "View",
      conditional: `{{equals ${dataIds.value} ${count === 1 ? `"A"` : count}}}`,
      style: {
        flex: 1,
        flexDirection: "row",
        justifyContent: columns.length === 1 ? "center" : "space-between",
      },
      children: columns,
    },
  ];
}

const template: Templates.Props<DataId> = {
  templateId,
  dateCreated: dateToDateString(new Date()),
  dateUpdated: dateToDateString(new Date()),
  name: text["template.built_in.playing-cards.name"],
  schemaOrder: [dataIds.value, dataIds.suit, dataIds.color],
  schema: {
    [dataIds.value]: {
      id: dataIds.value,
      name: text["template.built_in.playing-cards.value.name"],
      type: "text",
    },
    [dataIds.suit]: {
      id: dataIds.suit,
      name: text["template.built_in.playing-cards.suit.name"],
      type: "text",
    },
    [dataIds.color]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Color],
      defaultValidatedValue: {
        value: fixed.cardPresets.builtInTemplatesFallbackColor,
        type: "color",
      },
    },
  },
  markup: [
    {
      type: "View",
      style: {
        flex: 1,
        backgroundColor: colorFunction("lightness", dataIds.color, 98),
      },
      children: [
        {
          type: "View",
          style: {
            flex: 1,
          },
          children: [
            {
              type: "View",
              children: corner,
              style: {
                transform: "rotate(180deg)",
                position: "absolute",
                bottom: 0,
                right: 0,
              },
            },
            {
              type: "View",
              children: corner,
              style: {
                position: "absolute",
                top: 0,
                left: 0,
              },
            },
            {
              type: "View",
              style: {
                flex: 1,
                padding: 10,
                opacity: iconOpacity,
              },
              children: [
                ...singleIcon("J"),
                ...singleIcon("Q"),
                ...singleIcon("K"),
                ...repeatSuit(1),
                ...repeatSuit(2),
                ...repeatSuit(3),
                ...repeatSuit(4),
                ...repeatSuit(5),
                ...repeatSuit(6),
                ...repeatSuit(7),
                ...repeatSuit(8),
                ...repeatSuit(9),
                ...repeatSuit(10),
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default template;
