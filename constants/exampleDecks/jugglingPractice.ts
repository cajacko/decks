import { ExampleDeck } from "./types";
import front from "@/constants/builtInTemplates/front";
import back from "@/constants/builtInTemplates/back";

const deck: ExampleDeck = {
  name: "Juggling Practice",
  description:
    "A deck for practicing juggling. Practice the top card for 5 minutes, discard it and move on to the next card. When you've done them all, shuffle the deck and start again. Add new cards as you learn new tricks and remove cards you don't enjoy.",
  templates: {
    back: {
      templateId: back.templateId,
      dataTemplateMapping: {
        color: {
          dataId: "color",
          templateDataId: back.schema.color.id,
        },
      },
    },
    front: {
      dataTemplateMapping: {
        title: {
          dataId: "title",
          templateDataId: front.schema.title.id,
        },
        description: {
          dataId: "description",
          templateDataId: front.schema.description.id,
        },
        color: {
          dataId: "color",
          templateDataId: front.schema.color.id,
        },
      },
      templateId: front.templateId,
    },
  },
  dataSchema: {
    color: {
      id: "color",
      type: "color",
      defaultValidatedValue: {
        type: "color",
        value: "#F0F0D7",
      },
    },
  },
  cards: [
    {
      title: "3 ball cascade",
      description:
        "The basic pattern of juggling. Throw each ball in an arc from one hand to the other, so that each ball is caught in the opposite hand.",
    },
    {
      title: "3 ball shower",
      description:
        "Throw two balls in an arc from one hand to the other, and the third ball in a high arc from the same hand to the other. The balls should be caught in the same order they were thrown.",
    },
    {
      title: "3 ball columns",
      description:
        "Throw all three balls straight up and down, so that they land in the same hand they were thrown from.",
    },
    {
      title: "3 ball reverse cascade",
      description:
        "Throw each ball in an arc from one hand to the other, but catch them in the same hand they were thrown from.",
    },
    {
      title: "3 ball mills mess",
      description:
        "Throw the balls in a circular pattern, so that each ball is caught by the opposite hand.",
    },
    {
      title: "3 ball box",
      description:
        "Throw the balls in a square pattern, so that each ball is caught by the opposite hand.",
    },
    {
      title: "3 ball half shower",
      description:
        "Throw one ball in a high arc and the other two in a lower arc, catching them in the same order they were thrown.",
    },
    {
      title: "3 ball tennis",
      description:
        "Throw one ball in a high arc and the other two in a lower arc, catching them in the same order they were thrown, but with one ball always being thrown higher.",
    },
    {
      title: "3 ball snake",
      description:
        "Throw the balls in a pattern that resembles a snake, with each ball following the previous one.",
    },
    {
      title: "3 ball windmill",
      description:
        "Throw the balls in a circular pattern, with each ball following the previous one in a windmill-like motion.",
    },
    {
      title: "3 ball factory",
      description:
        "Throw the balls in a pattern that resembles a factory, with each ball following the previous one in a mechanical motion.",
    },
    {
      title: "3 ball yo-yo",
      description:
        "Throw the balls in a pattern that resembles a yo-yo, with each ball following the previous one in an up-and-down motion.",
    },
    {
      title: "3 ball shower with a twist",
      description:
        "Throw the balls in a shower pattern, but with a twist in the middle of the pattern.",
    },
    {
      title: "3 ball under the leg",
      description:
        "Throw the balls in a pattern that involves throwing one ball under your leg.",
    },
    {
      title: "3 ball behind the back",
      description:
        "Throw the balls in a pattern that involves throwing one ball behind your back.",
    },
    {
      title: "3 ball over the shoulder",
      description:
        "Throw the balls in a pattern that involves throwing one ball over your shoulder.",
    },
    {
      title: "3 ball under the arm",
      description:
        "Throw the balls in a pattern that involves throwing one ball under your arm.",
    },
    {
      title: "3 ball claw catch",
      description:
        "Catch the balls with a claw-like motion, grabbing them out of the air.",
    },
    {
      title: "3 ball penguin catch",
      description:
        "Catch the balls with your hands turned inward, like a penguin.",
    },
    {
      title: "3 ball backcross",
      description:
        "Throw the balls in a pattern that involves crossing your arms behind your back.",
    },
    {
      title: "3 ball multiplex",
      description:
        "Throw multiple balls at once, catching them in the same order they were thrown.",
    },
    {
      title: "3 ball flash",
      description:
        "Throw all three balls in the air at once, catching them in the same order they were thrown.",
    },
    {
      title: "3 ball cascade with a spin",
      description:
        "Throw the balls in a cascade pattern, but with a spin in the middle of the pattern.",
    },
    {
      title: "3 ball shower with a spin",
      description:
        "Throw the balls in a shower pattern, but with a spin in the middle of the pattern.",
    },
    {
      title: "3 ball columns with a spin",
      description:
        "Throw the balls in a columns pattern, but with a spin in the middle of the pattern.",
    },
    {
      title: "3 ball reverse cascade with a spin",
      description:
        "Throw the balls in a reverse cascade pattern, but with a spin in the middle of the pattern.",
    },
  ],
};

export default deck;
