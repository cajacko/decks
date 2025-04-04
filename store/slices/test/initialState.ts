import { RootState } from "@/store/types";

export const initialState: RootState = {
  cards: {
    cardsById: {},
  },
  decks: {
    decksById: {},
  },
  includedData: {
    data: [],
    dateFetched: null,
  },
  sync: {
    lastPulled: null,
    lastPushed: null,
    lastSynced: null,
    lastModifiedImportantChangesLocally: null,
  },
  templates: {
    templatesById: {},
  },
  tabletops: {
    tabletopsById: {},
  },
  userSettings: {
    settings: null,
  },
};
