import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";
import {
  ReservedDataSchemaIds,
  reservedDataSchemaItems,
} from "@/constants/reservedDataSchemaItems";
import { colorFunction } from "@/components/Template/handlebars";

// NOTE: Do not change these ID's as people's existing mappings will break
const { templateId, dataItemId } = builtInTemplateIds("playing-cards");

const dataItemIds = {
  suit: dataItemId("suit"),
  value: dataItemId("value"),
  color: ReservedDataSchemaIds.Color,
};

const mainSuitSize = 10;
const faceCardOffset = 2;
const iconOpacity = 0.75;

const corner: Templates.Markup = [
  {
    type: "view",
    style: {
      justifyContent: "center",
      alignItems: "center",
      padding: 1,
    },
    children: [
      {
        type: "text",
        text: `{{${dataItemIds.value}}}`,
        style: {
          fontSize: 8,
          textAlign: "center",
          color: colorFunction("lightness", dataItemIds.color, 30),
        },
      },
      {
        type: "text",
        text: `{{${dataItemIds.suit}}}`,
        conditional: dataItemIds.suit,
        style: {
          fontSize: 6,
          textAlign: "center",
          opacity: iconOpacity,
        },
      },
    ],
  },
];

function singleIcon(value: string): Templates.Markup {
  let text: string;

  switch (value.toLowerCase().trim()) {
    case "a":
      text = `{{${dataItemIds.suit}}}`;
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
      type: "view",
      conditional: `{{equals ${dataItemIds.value} "${value}"}}`,
      style: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colorFunction("lightness", dataItemIds.color, 30),
        borderWidth: 0.5,
      },
      children: [
        {
          type: "text",
          text: `{{${dataItemIds.suit}}}`,
          style: {
            fontSize: mainSuitSize,
            position: "absolute",
            top: faceCardOffset,
            left: faceCardOffset,
          },
        },
        {
          type: "text",
          text,
          style: {
            fontSize: 30,
          },
        },
        {
          type: "text",
          text: `{{${dataItemIds.suit}}}`,
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

function repeatSuit(count: number): Templates.Markup {
  const numberPattern = numberPatterns[count - 1];

  if (!numberPattern) return [];

  const columns: Templates.Markup = [];

  numberPattern.forEach((column, i) => {
    const isFirstColumn = i === 0;
    const isLastColumn = i === numberPattern.length - 1;
    const rows: Templates.Markup = [];

    column.forEach((hasSuitIcon, i) => {
      // If the row is in the bottom half of rows (middle counts as top), flip the suit icon
      const shouldFlip = i >= Math.ceil(column.length / 2);

      rows.push({
        type: "text",
        text: hasSuitIcon ? `{{${dataItemIds.suit}}}` : "",
        style: {
          fontSize: mainSuitSize,
          textAlign: "center",
          transform: shouldFlip ? [{ rotate: "180deg" }] : "none",
        },
      });
    });

    columns.push({
      type: "view",
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
      type: "view",
      conditional: `{{equals ${dataItemIds.value} ${count === 1 ? `"A"` : count}}}`,
      style: {
        flex: 1,
        flexDirection: "row",
        justifyContent: columns.length === 1 ? "center" : "space-between",
      },
      children: columns,
    },
  ];
}

const template = {
  templateId,
  name: text["template.built_in.playing-cards.name"],
  schemaOrder: [dataItemIds.value, dataItemIds.suit, dataItemIds.color],
  schema: {
    [dataItemIds.value]: {
      id: dataItemIds.value,
      name: text["template.built_in.playing-cards.value.name"],
      type: Templates.DataType.Text,
    },
    [dataItemIds.suit]: {
      id: dataItemIds.suit,
      name: text["template.built_in.playing-cards.suit.name"],
      type: Templates.DataType.Text,
    },
    [dataItemIds.color]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Color],
      defaultValidatedValue: {
        value: fixed.cardPresets.yellow,
        type: Templates.DataType.Color,
      },
    },
  },
  markup: [
    {
      type: "view",
      style: {
        flex: 1,
        backgroundColor: colorFunction("lightness", dataItemIds.color, 98),
      },
      children: [
        {
          type: "view",
          style: {
            flex: 1,
          },
          children: [
            {
              type: "view",
              children: corner,
              style: {
                transform: "rotate(180deg)",
                position: "absolute",
                bottom: 0,
                right: 0,
              },
            },
            {
              type: "view",
              children: corner,
              style: {
                position: "absolute",
                top: 0,
                left: 0,
              },
            },
            {
              type: "view",
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
} as const satisfies Templates.Props;

export default template;
