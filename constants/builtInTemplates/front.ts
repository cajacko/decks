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
const { templateId } = builtInTemplateIds("front");

const dataItemIds = {
  title: ReservedDataSchemaIds.Title,
  description: ReservedDataSchemaIds.Description,
  color: ReservedDataSchemaIds.Color,
  emoji: ReservedDataSchemaIds.Emoji,
};

const template = {
  templateId,
  name: text["template.built_in.front.name"],
  schemaOrder: [dataItemIds.title, dataItemIds.description, dataItemIds.color],
  schema: {
    [dataItemIds.title]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Title],
      defaultValidatedValue: {
        value: text["template.built_in.front.title.default"],
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.description]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Description],
      defaultValidatedValue: {
        value: text["template.built_in.front.description.default"],
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.emoji]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Emoji],
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
        backgroundColor: `{{${dataItemIds.color}}}`,
      },
      children: [
        {
          type: "view",
          style: {
            margin: 2,
            flex: 1,
            padding: 5,
            borderRadius: 2,
            backgroundColor: colorFunction("lightness", dataItemIds.color, 95),
            justifyContent: "center",
            alignItems: "center",
          },
          children: [
            {
              type: "text",
              text: `{{${dataItemIds.emoji}}}`,
              conditional: `{{${dataItemIds.emoji}}}`,
              style: {
                fontSize: 24,
                textAlign: "center",
                zIndex: 2,
                position: "relative",
                opacity: 0.5,
              },
            },
            {
              type: "text",
              text: `{{${dataItemIds.title}}}`,
              style: {
                fontSize: 8,
                textAlign: "center",
                color: colorFunction("lightness", dataItemIds.color, 30),
              },
            },
            {
              type: "text",
              text: `{{${dataItemIds.description}}}`,
              conditional: `{{${dataItemIds.description}}}`,
              style: {
                marginTop: 2,
                fontSize: 4,
                textAlign: "center",
                color: colorFunction("lightness", dataItemIds.color, 35),
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
