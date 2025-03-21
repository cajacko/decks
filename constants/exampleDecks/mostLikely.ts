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
    { title: "Who is most likely to get stuck in a bathroom stall?" },
    { title: "Who is the biggest drama queen?" },
    { title: "Who is most likely to trip over their own feet?" },
    { title: "Who is most likely to talk their way out of a speeding ticket?" },
    { title: "Who is most likely to laugh at the worst possible moment?" },
    { title: "Who is most likely to get kicked out of a bar?" },
    { title: "Who is most likely to order the weirdest thing on the menu?" },
    { title: "Who is most likely to send a drunk text they regret?" },
    { title: "Who is most likely to cry at a Pixar movie?" },
    { title: "Who is most likely to go viral for an embarrassing reason?" },
    { title: "Who is most likely to join a reality TV show?" },
    {
      title:
        "Who is most likely to mishear lyrics and confidently sing them wrong?",
    },
    { title: "Who is most likely to get lost in their own neighborhood?" },
    { title: "Who is most likely to make friends with a random stranger?" },
    {
      title: "Who is most likely to forget what they were saying mid-sentence?",
    },
    { title: "Who is most likely to be the last person at a party?" },
    {
      title:
        "Who is most likely to pretend they understand something when they don’t?",
    },
    { title: "Who is most likely to adopt a ridiculous pet?" },
    { title: "Who is most likely to streak through a public place?" },
    { title: "Who is most likely to get a tattoo on a dare?" },
    { title: "Who is most likely to get banned from a casino?" },
    { title: "Who is most likely to take a shot before noon?" },
    {
      title:
        "Who is most likely to wake up in a different country with no memory of how they got there?",
    },
    { title: "Who is most likely to crash a wedding?" },
    { title: "Who is most likely to get into a bar fight?" },
    { title: "Who is most likely to have a secret OnlyFans account?" },
    { title: "Who is most likely to skinny dip in a public place?" },
    { title: "Who is most likely to lose all their money gambling?" },
    { title: "Who is most likely to date someone way out of their league?" },
    { title: "Who is most likely to make out with a stranger?" },
    {
      title: "Who is most likely to go missing for a week with no explanation?",
    },
    { title: "Who is most likely to get caught sneaking into a VIP section?" },
    {
      title:
        "Who is most likely to steal something insignificant just for the thrill?",
    },
    { title: "Who is most likely to try a risky food challenge?" },
    { title: "Who is most likely to spend a night in jail?" },
    { title: "Who is most likely to befriend a celebrity?" },
    { title: "Who is most likely to wake up with a mysterious injury?" },
    { title: "Who is most likely to ghost someone after an amazing date?" },
    { title: "Who is most likely to slide into a celebrity’s DMs?" },
    { title: "Who is most likely to say 'I love you' too soon?" },
    { title: "Who is most likely to get married in Vegas?" },
    { title: "Who is most likely to have the wildest dating history?" },
    { title: "Who is most likely to be caught in a love triangle?" },
    { title: "Who is most likely to end a relationship via text?" },
    { title: "Who is most likely to flirt their way out of trouble?" },
    { title: "Who is most likely to fake an injury for attention?" },
    { title: "Who is most likely to start a cult?" },
    { title: "Who is most likely to become a billionaire?" },
    { title: "Who is most likely to quit their job on a whim?" },
    { title: "Who is most likely to get away with murder?" },
    { title: "Who is most likely to disappear and start a new life?" },
    { title: "Who is most likely to survive a zombie apocalypse?" },
    { title: "Who is most likely to get lost in IKEA?" },
    { title: "Who is most likely to be abducted by aliens?" },
  ],
};

export default deck;
