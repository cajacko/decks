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
const { templateId, dataItemId } = builtInTemplateIds("front");

export const dataIds = {
  title: ReservedDataSchemaIds.Title,
  description: ReservedDataSchemaIds.Description,
  color: ReservedDataSchemaIds.Color,
  emoji: dataItemId("emoji"),
} as const;

type DataId = (typeof dataIds)[keyof typeof dataIds];

const template: Templates.Props<DataId> = {
  templateId,
  name: text["template.built_in.front.name"],
  schemaOrder: [dataIds.title, dataIds.description, dataIds.color],
  schema: {
    [dataIds.title]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Title],
      defaultValidatedValue: {
        value: text["template.built_in.front.title.default"],
        type: "text",
        origin: "template",
      },
    },
    [dataIds.description]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Description],
      defaultValidatedValue: {
        value: text["template.built_in.front.description.default"],
        type: "text",
        origin: "template",
      },
    },
    [dataIds.emoji]: {
      id: dataIds.emoji,
      name: text["template.built_in.front.emoji.name"],
      type: "text",
      description: text["template.built_in.front.emoji.description"],
    },
    [dataIds.color]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Color],
      defaultValidatedValue: {
        value: fixed.cardPresets.builtInTemplatesFallbackColor,
        type: "color",
        origin: "template",
      },
    },
  },
  markup: [
    {
      type: "View",
      style: {
        flex: 1,
        backgroundColor: `{{${dataIds.color}}}`,
      },
      children: [
        {
          type: "View",
          style: {
            margin: 2,
            flex: 1,
            padding: 5,
            borderRadius: 2,
            backgroundColor: colorFunction("lightness", dataIds.color, 95),
            justifyContent: "center",
            alignItems: "center",
          },
          children: [
            {
              type: "Text",
              text: `{{${dataIds.emoji}}}`,
              conditional: `{{${dataIds.emoji}}}`,
              style: {
                fontSize: 24,
                textAlign: "center",
                zIndex: 2,
                position: "relative",
                opacity: 0.5,
              },
            },
            {
              type: "Text",
              text: `{{${dataIds.title}}}`,
              style: {
                fontSize: 8,
                textAlign: "center",
                color: colorFunction("lightness", dataIds.color, 30),
              },
            },
            {
              type: "Text",
              text: `{{${dataIds.description}}}`,
              conditional: `{{${dataIds.description}}}`,
              style: {
                marginTop: 2,
                fontSize: 4,
                textAlign: "center",
                color: colorFunction("lightness", dataIds.color, 35),
              },
            },
          ],
        },
      ],
    },
  ],
};

export default template;
