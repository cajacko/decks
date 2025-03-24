import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";
import {
  ReservedDataSchemaIds,
  reservedDataSchemaItems,
} from "@/constants/reservedDataSchemaItems";
import { colorFunction } from "@/components/templates/handlebars";

// NOTE: Do not change these ID's as people's existing mappings will break
const { templateId, dataItemId } = builtInTemplateIds("front");

export const dataIds = {
  title: ReservedDataSchemaIds.Title,
  description: ReservedDataSchemaIds.Description,
  color: ReservedDataSchemaIds.Color,
  emoji: dataItemId("emoji"),
  borderColor: dataItemId("borderColor"),
  backgroundColor: dataItemId("backgroundColor"),
  titleColor: dataItemId("titleColor"),
  descriptionColor: dataItemId("descriptionColor"),
} as const;

type DataId = (typeof dataIds)[keyof typeof dataIds];

const template: Templates.Props<DataId> = {
  templateId,
  name: text["template.built_in.front.name"],
  schemaOrder: [
    dataIds.title,
    dataIds.description,
    dataIds.color,
    dataIds.emoji,
    dataIds.titleColor,
    dataIds.descriptionColor,
    dataIds.borderColor,
    dataIds.backgroundColor,
  ],
  schema: {
    [dataIds.title]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Title],
      defaultValidatedValue: {
        value: text["template.built_in.front.title.default"],
        type: "text",
      },
    },
    [dataIds.description]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Description],
      defaultValidatedValue: {
        value: text["template.built_in.front.description.default"],
        type: "text",
      },
    },
    [dataIds.emoji]: {
      id: dataIds.emoji,
      name: text["template.built_in.front.emoji.name"],
      type: "text",
    },
    [dataIds.color]: {
      ...reservedDataSchemaItems[ReservedDataSchemaIds.Color],
      defaultValidatedValue: {
        value: fixed.cardPresets.builtInTemplatesFallbackColor,
        type: "color",
      },
    },
    [dataIds.backgroundColor]: {
      id: dataIds.backgroundColor,
      type: "color",
      name: text["template.built_in.front.background_color"],
    },
    [dataIds.titleColor]: {
      id: dataIds.titleColor,
      type: "color",
      name: text["template.built_in.front.title_color"],
    },
    [dataIds.descriptionColor]: {
      id: dataIds.descriptionColor,
      type: "color",
      name: text["template.built_in.front.description_color"],
    },
    [dataIds.borderColor]: {
      id: dataIds.borderColor,
      type: "color",
      name: text["template.built_in.front.border_color"],
    },
  },
  markup: [
    {
      type: "View",
      style: {
        flex: 1,
        backgroundColor: `{{#if ${dataIds.borderColor}}}{{${dataIds.borderColor}}}{{else}}{{${dataIds.color}}}{{/if}}`,
      },
      children: [
        {
          type: "View",
          style: {
            margin: 2,
            flex: 1,
            padding: 5,
            borderRadius: 2,
            backgroundColor: `{{#if ${dataIds.backgroundColor}}}{{${dataIds.backgroundColor}}}{{else}}${colorFunction("lightness", dataIds.color, 95)}{{/if}}`,
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
                color: `{{#if ${dataIds.titleColor}}}{{${dataIds.titleColor}}}{{else}}${colorFunction("lightness", dataIds.color, 30)}{{/if}}`,
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
                color: `{{#if ${dataIds.descriptionColor}}}{{${dataIds.descriptionColor}}}{{else}}${colorFunction("lightness", dataIds.color, 35)}{{/if}}`,
              },
            },
          ],
        },
      ],
    },
  ],
};

export default template;
