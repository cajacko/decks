import { ExampleDeck } from "./types";
import front from "@/constants/builtInTemplates/front";
import back from "@/constants/builtInTemplates/back";

const deck: ExampleDeck = {
  name: "Morning Pages Prompts",
  description:
    "Morning Pages is a daily journaling practice where you write three pages of stream-of-consciousness writing. Here are some prompts to get you started.",
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
        value: "#B7B1F2",
      },
    },
  },
  cards: [
    {
      title: "What's on your mind?",
      description: "Write about anything that comes to mind right now.",
    },
    {
      title: "What are you grateful for?",
      description: "Think about people, places, activities, and experiences.",
    },
    {
      title: "Describe your perfect day.",
      description:
        "Imagine a day where everything goes perfectly. What happens?",
    },
    {
      title: "What are your biggest goals?",
      description: "Write about the goals you want to achieve in your life.",
    },
    {
      title: "What are you afraid of?",
      description: "Explore your fears and why they scare you.",
    },
    {
      title: "Who inspires you?",
      description: "Think about people who inspire you and why.",
    },
    {
      title: "What are your strengths?",
      description: "List your strengths and how they help you.",
    },
    {
      title: "What are your weaknesses?",
      description: "Identify your weaknesses and how you can improve them.",
    },
    {
      title: "What makes you happy?",
      description: "Write about the things that bring you joy.",
    },
    {
      title: "What makes you sad?",
      description: "Explore the things that make you feel down.",
    },
    {
      title: "What are your favorite memories?",
      description: "Recall and describe your happiest memories.",
    },
    {
      title: "What are your biggest regrets?",
      description: "Write about the things you wish you had done differently.",
    },
    {
      title: "What are your dreams?",
      description: "Describe your dreams and what they mean to you.",
    },
    {
      title: "What are your hobbies?",
      description: "Write about the activities you enjoy in your free time.",
    },
    {
      title: "What are your favorite books?",
      description: "List your favorite books and why you love them.",
    },
    {
      title: "What are your favorite movies?",
      description: "Write about the movies that have impacted you the most.",
    },
    {
      title: "What are your favorite songs?",
      description: "List your favorite songs and why they resonate with you.",
    },
    {
      title: "What are your favorite places?",
      description: "Describe the places you love to visit.",
    },
    {
      title: "What are your favorite foods?",
      description: "Write about the foods you enjoy the most.",
    },
    {
      title: "What are your favorite quotes?",
      description: "List quotes that inspire you and why.",
    },
    {
      title: "What are your favorite activities?",
      description: "Write about the activities you love to do.",
    },
    {
      title: "What are your favorite memories from childhood?",
      description: "Recall and describe your happiest childhood memories.",
    },
    {
      title: "What are your favorite holiday traditions?",
      description: "Write about the traditions you cherish the most.",
    },
    {
      title: "What are your favorite family traditions?",
      description: "Describe the traditions that are special to your family.",
    },
    {
      title: "What are your favorite things about your home?",
      description: "Write about what you love most about your home.",
    },
    {
      title: "What are your favorite things about your job?",
      description: "Describe what you enjoy most about your work.",
    },
    {
      title: "What are your favorite things about your friends?",
      description: "Write about what you appreciate most about your friends.",
    },
    {
      title: "What are your favorite things about your partner?",
      description: "Describe what you love most about your partner.",
    },
    {
      title: "What are your favorite things about your pets?",
      description: "Write about what you love most about your pets.",
    },
    {
      title: "What are your favorite things about your community?",
      description: "Describe what you appreciate most about your community.",
    },
    {
      title: "What are your favorite things about your city?",
      description: "Write about what you love most about your city.",
    },
    {
      title: "What are your favorite things about your country?",
      description: "Describe what you appreciate most about your country.",
    },
    {
      title: "What are your favorite things about your culture?",
      description: "Write about what you love most about your culture.",
    },
    {
      title: "What are your favorite things about your heritage?",
      description: "Describe what you appreciate most about your heritage.",
    },
    {
      title: "What are your favorite things about your religion?",
      description: "Write about what you love most about your religion.",
    },
    {
      title: "What are your favorite things about your spirituality?",
      description: "Describe what you appreciate most about your spirituality.",
    },
    {
      title: "What are your favorite things about your body?",
      description: "Write about what you love most about your body.",
    },
    {
      title: "What are your favorite things about your mind?",
      description: "Describe what you appreciate most about your mind.",
    },
    {
      title: "What are your favorite things about your personality?",
      description: "Write about what you love most about your personality.",
    },
    {
      title: "What are your favorite things about your life?",
      description: "Describe what you appreciate most about your life.",
    },
    {
      title: "What are your favorite things about your future?",
      description: "Write about what you look forward to in your future.",
    },
    {
      title: "What are your favorite things about your past?",
      description: "Describe what you appreciate most about your past.",
    },
    {
      title: "What are your favorite things about your present?",
      description: "Write about what you love most about your present.",
    },
    {
      title: "What are your favorite things about your dreams?",
      description: "Describe what you appreciate most about your dreams.",
    },
    {
      title: "What are your favorite things about your goals?",
      description: "Write about what you love most about your goals.",
    },
    {
      title: "What are your favorite things about your achievements?",
      description: "Describe what you appreciate most about your achievements.",
    },
    {
      title: "What are your favorite things about your failures?",
      description: "Write about what you have learned from your failures.",
    },
    {
      title: "What are your favorite things about your challenges?",
      description: "Describe what you appreciate most about your challenges.",
    },
    {
      title: "What are your favorite things about your successes?",
      description: "Write about what you love most about your successes.",
    },
    {
      title: "What are your favorite things about your opportunities?",
      description:
        "Describe what you appreciate most about your opportunities.",
    },
    {
      title: "What are your favorite things about your experiences?",
      description: "Write about what you love most about your experiences.",
    },
    {
      title: "What are your favorite things about your lessons?",
      description: "Describe what you have learned from your lessons.",
    },
    {
      title: "What are your favorite things about your growth?",
      description: "Write about what you appreciate most about your growth.",
    },
    {
      title: "What are your favorite things about your journey?",
      description: "Describe what you love most about your journey.",
    },
    {
      title: "What are your favorite things about your path?",
      description: "Write about what you appreciate most about your path.",
    },
    {
      title: "What are your favorite things about your adventure?",
      description: "Describe what you love most about your adventure.",
    },
    {
      title: "What are your favorite things about your exploration?",
      description:
        "Write about what you appreciate most about your exploration.",
    },
    {
      title: "What are your favorite things about your discovery?",
      description: "Describe what you love most about your discovery.",
    },
    {
      title: "What are your favorite things about your creativity?",
      description:
        "Write about what you appreciate most about your creativity.",
    },
    {
      title: "What are your favorite things about your imagination?",
      description: "Describe what you love most about your imagination.",
    },
    {
      title: "What are your favorite things about your inspiration?",
      description:
        "Write about what you appreciate most about your inspiration.",
    },
    {
      title: "What are your favorite things about your motivation?",
      description: "Describe what you love most about your motivation.",
    },
    {
      title: "What are your favorite things about your determination?",
      description:
        "Write about what you appreciate most about your determination.",
    },
    {
      title: "What are your favorite things about your perseverance?",
      description: "Describe what you love most about your perseverance.",
    },
    {
      title: "What are your favorite things about your resilience?",
      description:
        "Write about what you appreciate most about your resilience.",
    },
    {
      title: "What are your favorite things about your strength?",
      description: "Describe what you love most about your strength.",
    },
    {
      title: "What are your favorite things about your courage?",
      description: "Write about what you appreciate most about your courage.",
    },
    {
      title: "What are your favorite things about your bravery?",
      description: "Describe what you love most about your bravery.",
    },
    {
      title: "What are your favorite things about your confidence?",
      description:
        "Write about what you appreciate most about your confidence.",
    },
    {
      title: "What are your favorite things about your self-esteem?",
      description: "Describe what you love most about your self-esteem.",
    },
    {
      title: "What are your favorite things about your self-worth?",
      description:
        "Write about what you appreciate most about your self-worth.",
    },
    {
      title: "What are your favorite things about your self-love?",
      description: "Describe what you love most about your self-love.",
    },
    {
      title: "What are your favorite things about your self-care?",
      description: "Write about what you appreciate most about your self-care.",
    },
    {
      title: "What are your favorite things about your self-awareness?",
      description: "Describe what you love most about your self-awareness.",
    },
    {
      title: "What are your favorite things about your self-discovery?",
      description:
        "Write about what you appreciate most about your self-discovery.",
    },
    {
      title: "What are your favorite things about your self-improvement?",
      description: "Describe what you love most about your self-improvement.",
    },
    {
      title: "What are your favorite things about your self-growth?",
      description:
        "Write about what you appreciate most about your self-growth.",
    },
    {
      title: "What are your favorite things about your self-development?",
      description: "Describe what you love most about your self-development.",
    },
    {
      title: "What are your favorite things about your self-empowerment?",
      description:
        "Write about what you appreciate most about your self-empowerment.",
    },
    {
      title: "What are your favorite things about your self-expression?",
      description: "Describe what you love most about your self-expression.",
    },
    {
      title: "What are your favorite things about your self-acceptance?",
      description:
        "Write about what you appreciate most about your self-acceptance.",
    },
    {
      title: "What are your favorite things about your self-respect?",
      description: "Describe what you love most about your self-respect.",
    },
    {
      title: "What are your favorite things about your self-discipline?",
      description:
        "Write about what you appreciate most about your self-discipline.",
    },
    {
      title: "What are your favorite things about your self-control?",
      description: "Describe what you love most about your self-control.",
    },
    {
      title: "What are your favorite things about your self-motivation?",
      description:
        "Write about what you appreciate most about your self-motivation.",
    },
    {
      title: "What are your favorite things about your self-reliance?",
      description: "Describe what you love most about your self-reliance.",
    },
    {
      title: "What are your favorite things about your self-sufficiency?",
      description:
        "Write about what you appreciate most about your self-sufficiency.",
    },
    {
      title: "What are your favorite things about your self-confidence?",
      description: "Describe what you love most about your self-confidence.",
    },
    {
      title: "What are your favorite things about your self-assurance?",
      description:
        "Write about what you appreciate most about your self-assurance.",
    },
    {
      title: "What are your favorite things about your self-belief?",
      description: "Describe what you love most about your self-belief.",
    },
    {
      title: "What are your favorite things about your self-trust?",
      description:
        "Write about what you appreciate most about your self-trust.",
    },
    {
      title: "What are your favorite things about your self-knowledge?",
      description: "Describe what you love most about your self-knowledge.",
    },
    {
      title: "What are your favorite things about your self-awareness?",
      description:
        "Write about what you appreciate most about your self-awareness.",
    },
  ],
};

export default deck;
