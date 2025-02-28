import { deleteDeck, createDeck } from "../combinedActions/decks";
import { store } from "../store";
import { selectDeck } from "../slices/decks";
import { Cards, Decks, Tabletops } from "../types";
import uuid from "@/utils/uuid";
import builtInTemplates from "@/config/builtInTemplates";
import minStackCount from "@/config/minStackCount";

export function deleteDeckHelper(props: {
  deckId: Decks.DeckId;
  cardIds?: Cards.CardId[];
  tabletopId?: string;
}) {
  const deck = selectDeck(store.getState(), props);

  const cardIds: Cards.CardId[] =
    props.cardIds ?? deck?.cards.map(({ cardId }) => cardId) ?? [];

  const tabletopId = deck?.defaultTabletopId ?? props.tabletopId ?? null;

  return deleteDeck({ cardIds, deckId: props.deckId, tabletopId });
}

export function createDeckHelper({ deckId }: { deckId: Decks.DeckId }) {
  const tabletopId = uuid();

  const deck: Decks.Props = {
    id: deckId,
    cards: [],
    dataSchema: {},
    dataSchemaOrder: [],
    defaultTabletopId: tabletopId,
    name: "New Deck",
    status: "creating",
    templates: {
      back: {
        dataTemplateMapping: {},
        templateId: builtInTemplates.back.templateId,
      },
      front: {
        dataTemplateMapping: {},
        templateId: builtInTemplates.front.templateId,
      },
    },
  };

  const cards: Cards.Props[] = [];

  // Generate stack ids equal to minStackCount
  const stackIds = Array.from({ length: minStackCount }, () => uuid());

  const stacksById: Tabletops.HistoryState["stacksById"] = stackIds.reduce(
    (acc, stackId) => ({
      ...acc,
      [stackId]: {
        id: stackId,
        cardInstances: [],
      },
    }),
    {},
  );

  const defaultTabletop: Tabletops.Props = {
    id: tabletopId,
    availableDecks: [deckId],
    history: {
      future: [],
      past: [],
      present: {
        cardInstancesById: {},
        stacksById,
        stacksIds: stackIds,
      },
    },
  };

  return createDeck({
    cards,
    deck,
    defaultTabletop,
  });
}
