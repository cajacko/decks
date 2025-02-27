import { Templates } from "@/store/types";

const basicText: Templates.Props<
  "template1-title" | "template1-description" | "template1-backgroundColor"
> = {
  templateId: "basicText",
  name: "Front Template",
  schemaOrder: [
    "template1-title",
    "template1-description",
    "template1-backgroundColor",
  ],
  schema: {
    "template1-title": {
      id: "template1-title",
      name: "Title",
      type: Templates.DataType.Text,
    },
    "template1-description": {
      id: "template1-description",
      name: "Description",
      type: Templates.DataType.Text,
    },
    "template1-backgroundColor": {
      id: "template1-backgroundColor",
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
        backgroundColor: "{{template1-backgroundColor}}",
      },
      children: [
        {
          type: "text",
          text: "{{template1-title}}",
          style: {
            fontSize: 8,
            textAlign: "center",
          },
        },
        {
          type: "text",
          text: "Description: {{template1-description}}",
          conditional: "template1-description",
          style: {
            marginTop: 2,
            fontSize: 4,
            textAlign: "center",
          },
        },
      ],
    },
  ],
};

const plainBack: Templates.Props = {
  templateId: "plainBack",
  name: "Back Template",
  schemaOrder: [],
  schema: {
    "template2-background": {
      id: "template2-background",
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
        backgroundColor: "grey",
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
};

const templatesById = {
  basicText,
  plainBack,
} as const satisfies Templates.State["templatesById"];

export default templatesById;
