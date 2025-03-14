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

export const dataIds = {
  text: dataItemId("text"),
  color: ReservedDataSchemaIds.Color,
  emoji: dataItemId("emoji"),
} as const;

type DataId = (typeof dataIds)[keyof typeof dataIds];

const template: Templates.Props<DataId> = {
  templateId,
  name: text["template.built_in.back.title"],
  schemaOrder: [dataIds.text, dataIds.color],
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
        value: fixed.cardPresets.yellow,
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
            fontSize: 24,
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            opacity: 0.5,
          },
        },
        {
          type: "Text",
          text: `{{${dataIds.text}}}`,
          conditional: `{{${dataIds.text}}}`,
          style: {
            color: colorFunction("lightness", dataIds.color, 15),
            fontSize: 10,
            textAlign: "center",
            zIndex: 2,
            position: "relative",
            fontFamily: "Zain",
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
            backgroundColor: colorFunction("lightness", dataIds.color, 70),
            transform: [{ rotate: "-45deg" }, { translateX: "-10%" }],
          },
          children: [
            {
              type: "View",
              style: {
                flex: 1,
                flexDirection: "row",
                backgroundColor: colorFunction("lightness", dataIds.color, 80),
              },
              children: [
                {
                  type: "View",
                  style: {
                    flex: 1,
                    backgroundColor: colorFunction(
                      "lightness",
                      dataIds.color,
                      65,
                    ),
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
