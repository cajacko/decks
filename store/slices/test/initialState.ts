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
    lastSyncSize: null,
    lastPulled: null,
    lastPushed: null,
    lastSynced: null,
    lastRemovedDeletedContent: null,
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
