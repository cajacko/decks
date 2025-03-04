import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";
import text from "@/constants/text";
import { fixed } from "@/constants/colors";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("front");

const dataItemIds = {
  title: dataItemId("title"),
  description: dataItemId("description"),
  backgroundColor: dataItemId("backgroundColor"),
  titleColor: dataItemId("titleColor"),
  descriptionColor: dataItemId("descriptionColor"),
  borderColor: dataItemId("borderColor"),
  // titleSize: dataItemId("titleSize"),
  // descriptionSize: dataItemId("descriptionSize"),
};

const template = {
  templateId,
  name: text["template.built_in.front.name"],
  schemaOrder: [
    dataItemIds.title,
    dataItemIds.description,
    dataItemIds.backgroundColor,
  ],
  schema: {
    [dataItemIds.title]: {
      id: dataItemIds.title,
      name: text["template.built_in.front.title"],
      type: Templates.DataType.Text,
      defaultValidatedValue: {
        value: text["template.built_in.front.title.default"],
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.description]: {
      id: dataItemIds.description,
      name: text["template.built_in.front.description"],
      type: Templates.DataType.Text,
      defaultValidatedValue: {
        value: text["template.built_in.front.description.default"],
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.titleColor]: {
      id: dataItemIds.titleColor,
      name: text["template.built_in.front.title_color"],
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "#987315",
        type: Templates.DataType.Color,
      },
    },
    [dataItemIds.descriptionColor]: {
      id: dataItemIds.descriptionColor,
      name: text["template.built_in.front.description_color"],
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "#987315",
        type: Templates.DataType.Color,
      },
    },
    // [dataItemIds.titleSize]: {
    //   id: dataItemIds.titleSize,
    //   name: "Title Size",
    //   type: Templates.DataType.Number,
    //   defaultValidatedValue: {
    //     value: 8,
    //     type: Templates.DataType.Number,
    //   },
    // },
    // [dataItemIds.descriptionSize]: {
    //   id: dataItemIds.descriptionSize,
    //   name: "Description Size",
    //   type: Templates.DataType.Number,
    //   defaultValidatedValue: {
    //     value: 4,
    //     type: Templates.DataType.Number,
    //   },
    // },
    [dataItemIds.backgroundColor]: {
      id: dataItemIds.backgroundColor,
      name: text["template.built_in.front.background_color"],
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "#fff8e6",
        type: Templates.DataType.Color,
      },
    },
    [dataItemIds.borderColor]: {
      id: dataItemIds.borderColor,
      name: text["template.built_in.front.border_color"],
      type: Templates.DataType.Color,
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
        backgroundColor: `{{${dataItemIds.borderColor}}}`,
      },
      children: [
        {
          type: "view",
          style: {
            margin: 2,
            flex: 1,
            padding: 5,
            borderRadius: 2,
            backgroundColor: `{{${dataItemIds.backgroundColor}}}`,
            justifyContent: "center",
            alignItems: "center",
          },
          children: [
            {
              type: "text",
              text: `{{${dataItemIds.title}}}`,
              style: {
                fontSize: 8,
                textAlign: "center",
                color: `{{${dataItemIds.titleColor}}}`,
              },
            },
            {
              type: "text",
              text: `{{${dataItemIds.description}}}`,
              conditional: dataItemIds.description,
              style: {
                marginTop: 2,
                fontSize: 4,
                textAlign: "center",
                color: `{{${dataItemIds.descriptionColor}}}`,
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
