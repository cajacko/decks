import { RootState } from "../types";

const state: RootState = {
  cards: {
    cardsById: {},
  },
  templates: {
    templatesById: {},
  },
  decks: {
    decksById: {},
    deckIds: [],
  },
  tabletops: {
    tabletopsById: {},
  },
  userSettings: {},
};

export default state;
