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
        value: fixed.cardPresets.black,
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
        backgroundColor: `{{${dataItemIds.backgroundColor}}}`,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      },
      children: [
        {
          type: "text",
          text: `{{${deckTemplateIds.name}}}`,
          style: {
            color: `{{${dataItemIds.textColor}}}`,
            fontSize: 8,
            textAlign: "center",
          },
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
