import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("front");

const dataItemIds = {
  title: dataItemId("title"),
  description: dataItemId("description"),
  backgroundColor: dataItemId("backgroundColor"),
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
    },
    [dataItemIds.description]: {
      id: dataItemIds.description,
      name: "Description",
      type: Templates.DataType.Text,
    },
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
          },
        },
        {
          type: "text",
          text: `Description: {{${dataItemIds.description}}}`,
          conditional: dataItemIds.description,
          style: {
            marginTop: 2,
            fontSize: 4,
            textAlign: "center",
          },
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
