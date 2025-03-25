import { Templates } from "@/store/types";
import builtInTemplateIds, {
  deckTemplateIds,
} from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";
import {
  ReservedDataSchemaIds,
  reservedDataSchemaItems,
} from "@/constants/reservedDataSchemaItems";
import { colorFunction } from "@/components/templates/handlebars";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("back");

export const dataIds = {
  text: dataItemId("text"),
  color: ReservedDataSchemaIds.Color,
  emoji: dataItemId("emoji"),
  backgroundColor: dataItemId("backgroundColor"),
  textColor: dataItemId("textColor"),
  textSize: dataItemId("textSize"),
  emojiSize: dataItemId("emojiSize"),
} as const;

type DataId = (typeof dataIds)[keyof typeof dataIds];

const template: Templates.Props<DataId> = {
  templateId,
  name: text["template.built_in.back.title"],
  schemaOrder: [
    dataIds.text,
    dataIds.emoji,
    dataIds.color,
    dataIds.backgroundColor,
    dataIds.textColor,
  ],
  schema: {
    [dataIds.text]: {
      id: dataIds.text,
      name: text["template.built_in.back.text"],
      type: "text",
      defaultValidatedValue: {
        type: "text",
        value: `{{${deckTemplateIds.name}}}`,
      },
    },
    [dataIds.emoji]: {
      id: dataIds.emoji,
      name: text["template.built_in.back.emoji"],
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
      name: text["template.built_in.back.background_color"],
    },
    [dataIds.textColor]: {
      id: dataIds.textColor,
      type: "color",
      name: text["template.built_in.back.text_color"],
    },
    [dataIds.emojiSize]: {
      id: dataIds.emojiSize,
      type: "text",
      name: text["template.built_in.front.emoji_size"],
      defaultValidatedValue: {
        type: "text",
        value: "24",
      },
    },
    [dataIds.textSize]: {
      id: dataIds.textSize,
      type: "text",
      name: text["template.built_in.back.text_size"],
      defaultValidatedValue: {
        type: "text",
        value: "10",
      },
    },
  },
  markup: [
    {
      type: "View",
      style: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        position: "relative",
        overflow: "hidden",
      },
      children: [
        {
          type: "Text",
          text: `{{${dataIds.emoji}}}`,
          conditional: `{{${dataIds.emoji}}}`,
          style: {
            fontSize: `{{${dataIds.emojiSize}}}`,
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            opacity: 0.75,
          },
        },
        {
          type: "Text",
          text: `{{${dataIds.text}}}`,
          conditional: `{{${dataIds.text}}}`,
          style: {
            color: `{{#if ${dataIds.textColor}}}{{${dataIds.textColor}}}{{else}}${colorFunction("lightness", dataIds.color, 15)}{{/if}}`,
            fontSize: `{{${dataIds.textSize}}}`,
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            fontFamily: "LuckiestGuy",
          },
        },
        {
          type: "View",
          style: {
            position: "absolute",
            top: "-100%",
            left: "-100%",
            right: "-100%",
            bottom: "-100%",
            zIndex: 1,
            backgroundColor: `{{#if ${dataIds.backgroundColor}}}${colorFunction("lighten", dataIds.backgroundColor, 0.2)}{{else}}${colorFunction("lightness", dataIds.color, 70)}{{/if}}`,
            transform: [{ rotate: "-45deg" }, { translateX: "-10%" }],
          },
          children: [
            {
              type: "View",
              style: {
                flex: 1,
                flexDirection: "row",
                backgroundColor: `{{#if ${dataIds.backgroundColor}}}{{${dataIds.backgroundColor}}}{{else}}${colorFunction("lightness", dataIds.color, 80)}{{/if}}`,
              },
              children: [
                {
                  type: "View",
                  style: {
                    flex: 1,
                    backgroundColor: `{{#if ${dataIds.backgroundColor}}}${colorFunction("darken", dataIds.backgroundColor, 0.2)}{{else}}${colorFunction("lightness", dataIds.color, 65)}{{/if}}`,
                  },
                },
                {
                  type: "View",
                  style: {
                    flex: 1,
                  },
                },
              ],
            },
            {
              type: "View",
              style: {
                flex: 1,
              },
            },
          ],
        },
      ],
    },
  ],
};

export default template;
