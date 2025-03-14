import { ExampleDeck } from "./types";
import front, {
  dataIds as frontDataIds,
} from "@/constants/builtInTemplates/front";
import back, {
  dataIds as backDataIds,
} from "@/constants/builtInTemplates/back";

const dataIds = {
  title: "title",
  description: "description",
  color: "color",
  backgroundColor: "backgroundColor",
  borderColor: "borderColor",
  textColor: "textColor",
};

const deck: ExampleDeck<Record<typeof dataIds.title, string>> = {
  name: "Most Likely",
  description:
    "Who's the most likely to do something? Find out with this fun game!\n\nDraw a card, read aloud, and on the count of 5 everyone points to the person they think is most likely to do that thing. The person with the most fingers pointed at them wins the round!",
  templates: {
    back: {
      templateId: back.templateId,
      dataTemplateMapping: {
        [backDataIds.color]: {
          dataId: dataIds.color,
          templateDataId: backDataIds.color,
        },
        [backDataIds.textColor]: {
          dataId: dataIds.textColor,
          templateDataId: backDataIds.textColor,
        },
        [backDataIds.backgroundColor]: {
          dataId: dataIds.backgroundColor,
          templateDataId: backDataIds.backgroundColor,
        },
      },
    },
    front: {
      dataTemplateMapping: {
        [frontDataIds.title]: {
          dataId: dataIds.title,
          templateDataId: frontDataIds.title,
        },
        [frontDataIds.description]: {
          dataId: dataIds.description,
          templateDataId: frontDataIds.description,
          defaultValidatedValue: {
            type: "null",
            value: null,
          },
        },
        [frontDataIds.color]: {
          dataId: dataIds.color,
          templateDataId: frontDataIds.color,
          defaultValidatedValue: {
            type: "null",
            value: null,
          },
        },
        [frontDataIds.backgroundColor]: {
          dataId: dataIds.backgroundColor,
          templateDataId: frontDataIds.backgroundColor,
        },
        [frontDataIds.borderColor]: {
          dataId: dataIds.borderColor,
          templateDataId: frontDataIds.borderColor,
        },
        [frontDataIds.descriptionColor]: {
          dataId: dataIds.textColor,
          templateDataId: frontDataIds.descriptionColor,
        },
        [frontDataIds.titleColor]: {
          dataId: dataIds.textColor,
          templateDataId: frontDataIds.titleColor,
        },
      },
      templateId: front.templateId,
    },
  },
  dataSchema: {
    [dataIds.description]: {
      id: dataIds.description,
      type: "text",
      defaultValidatedValue: {
        type: "null",
        value: null,
      },
    },
    [dataIds.title]: {
      id: dataIds.title,
      type: "text",
    },
    [dataIds.backgroundColor]: {
      id: dataIds.backgroundColor,
      type: "color",
      defaultValidatedValue: {
        type: "color",
        value: "#1d1a26",
      },
    },
    [dataIds.borderColor]: {
      id: dataIds.borderColor,
      type: "color",
      defaultValidatedValue: {
        type: "color",
        value: "#131118",
      },
    },
    [dataIds.textColor]: {
      id: dataIds.textColor,
      type: "color",
      defaultValidatedValue: {
        type: "color",
        value: "#ededed",
      },
    },
  },
  cards: [
    { title: "Who is most likely to go to prison?" },
    { title: "Who is the biggest drama queen?" },
  ],
};

export default deck;
