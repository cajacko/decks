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
import { colorFunction } from "@/components/Template/handlebars";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("back");

const dataItemIds = {
  text: dataItemId("text"),
  color: ReservedDataSchemaIds.Color,
  emoji: dataItemId("emoji"),
};

const template: Templates.Props = {
  templateId,
  name: text["template.built_in.back.title"],
  schemaOrder: [dataItemIds.text, dataItemIds.color],
  schema: {
    [dataItemIds.text]: {
      id: dataItemIds.text,
      name: text["template.built_in.back.text"],
      type: Templates.DataType.Text,
    },
    [dataItemIds.emoji]: {
      id: dataItemIds.emoji,
      name: text["template.built_in.back.emoji"],
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
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        position: "relative",
        overflow: "hidden",
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
          text: `{{#if ${dataItemIds.text}}}{{${dataItemIds.text}}}{{else}}{{${deckTemplateIds.name}}}{{/if}}`,
          style: {
            color: colorFunction("lightness", dataItemIds.color, 15),
            fontSize: 10,
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            fontFamily: "Zain",
          },
        },
        {
          type: "view",
          style: {
            position: "absolute",
            top: "-100%",
            left: "-100%",
            right: "-100%",
            bottom: "-100%",
            zIndex: 1,
            backgroundColor: colorFunction("lightness", dataItemIds.color, 70),
            transform: [{ rotate: "-45deg" }, { translateX: "-10%" }],
          },
          children: [
            {
              type: "view",
              style: {
                flex: 1,
                flexDirection: "row",
                backgroundColor: colorFunction(
                  "lightness",
                  dataItemIds.color,
                  80,
                ),
              },
              children: [
                {
                  type: "view",
                  style: {
                    flex: 1,
                    backgroundColor: colorFunction(
                      "lightness",
                      dataItemIds.color,
                      65,
                    ),
                  },
                },
                {
                  type: "view",
                  style: {
                    flex: 1,
                  },
                },
              ],
            },
            {
              type: "view",
              style: {
                flex: 1,
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
