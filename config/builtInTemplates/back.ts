import { Templates } from "@/store/types";
import builtInTemplateIds from "@/utils/builtInTemplateIds";

// NOTE: Do not change these ID's as people's existing mappings will break
const { dataItemId, templateId } = builtInTemplateIds("back");

const dataItemIds = {
  backgroundColor: dataItemId("backgroundColor"),
};

const template: Templates.Props = {
  templateId,
  name: "Back Template",
  schemaOrder: [dataItemIds.backgroundColor],
  schema: {
    [dataItemIds.backgroundColor]: {
      id: dataItemIds.backgroundColor,
      name: "Background Colour",
      type: Templates.DataType.Color,
      defaultValidatedValue: {
        value: "grey",
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
          text: "BACK TEMPLATE",
          style: {
            fontSize: 8,
            textAlign: "center",
          },
        },
      ],
    },
  ],
} as const satisfies Templates.Props;

export default template;
