import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("front");

const dataItemIds = {
  title: dataItemId("title"),
  description: dataItemId("description"),
  backgroundColor: dataItemId("backgroundColor"),
  titleColor: dataItemId("titleColor"),
  descriptionColor: dataItemId("descriptionColor"),
  // titleSize: dataItemId("titleSize"),
  // descriptionSize: dataItemId("descriptionSize"),
};

const template = {
  templateId,
  name: "Front Template",
  schemaOrder: [
    dataItemIds.title,
    dataItemIds.description,
    dataItemIds.backgroundColor,
  ],
  schema: {
    [dataItemIds.title]: {
      id: dataItemIds.title,
      name: "Title",
      type: Templates.DataType.Text,
      defaultValidatedValue: {
        value: "Title",
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.description]: {
      id: dataItemIds.description,
      name: "Description",
      type: Templates.DataType.Text,
      defaultValidatedValue: {
        value: "Description",
        type: Templates.DataType.Text,
      },
    },
    [dataItemIds.titleColor]: {
      id: dataItemIds.titleColor,
      name: "Title Colour",
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "black",
        type: Templates.DataType.Color,
      },
    },
    [dataItemIds.descriptionColor]: {
      id: dataItemIds.descriptionColor,
      name: "Description Colour",
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "black",
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
      name: "Background Colour",
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "white",
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
        backgroundColor: `{{${dataItemIds.backgroundColor}}}`,
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
} as const satisfies Templates.Props;

export default template;
