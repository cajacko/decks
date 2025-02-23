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
      defaultValue: {
        value: "red",
        type: Templates.DataType.Color,
      },
    },
  },
  markup: [
    {
      id: "markup1",
      type: "text",
      text: "Front of the card",
    },
  ],
};

const plainBack: Templates.Props = {
  templateId: "plainBack",
  name: "Back Template",
  schemaOrder: [],
  schema: {},
  markup: [
    {
      id: "markup1",
      type: "text",
      text: "Back of the card",
    },
  ],
};

const templatesById = {
  basicText,
  plainBack,
} as const satisfies Templates.State["templatesById"];

export default templatesById;
