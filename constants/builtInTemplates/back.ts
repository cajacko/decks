import { Templates } from "@/store/types";
import builtInTemplateIds, {
  deckTemplateIds,
} from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("back");

const dataItemIds = {
  text: dataItemId("text"),
  textColor: dataItemId("textColor"),
  backgroundColor: dataItemId("backgroundColor"),
};

const template: Templates.Props = {
  templateId,
  name: text["template.built_in.back.title"],
  schemaOrder: [dataItemIds.backgroundColor],
  schema: {
    [dataItemIds.text]: {
      id: dataItemIds.text,
      name: text["template.built_in.back.text"],
      type: Templates.DataType.Text,
    },
    [dataItemIds.textColor]: {
      id: dataItemIds.textColor,
      name: text["template.built_in.back.text_color"],
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "#765804",
        type: Templates.DataType.Color,
      },
    },
    [dataItemIds.backgroundColor]: {
      id: dataItemIds.backgroundColor,
      name: text["template.built_in.back.background_color"],
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: fixed.cardPresets.grey,
        type: Templates.DataType.Color,
      },
    },
  },
  markup: [
    {
      type: "view",
      style: {
        flex: 1,
        // backgroundColor: `{{${dataItemIds.backgroundColor}}}`,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        position: "relative",
        overflow: "hidden",
      },
      children: [
        {
          type: "text",
          text: `{{${deckTemplateIds.name}}}`,
          style: {
            color: `{{${dataItemIds.textColor}}}`,
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
            backgroundColor: "#ffd151",
            transform: [{ rotate: "-45deg" }, { translateX: "-10%" }],
          },
          children: [
            {
              type: "view",
              style: {
                flex: 1,
                flexDirection: "row",
                backgroundColor: "#f8c537",
              },
              children: [
                {
                  type: "view",
                  style: {
                    flex: 1,
                    backgroundColor: "#edb230",
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
