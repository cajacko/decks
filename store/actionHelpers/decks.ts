import { deleteDeck, createDeck } from "../combinedActions/decks";
import { store } from "../store";
import { selectDeck } from "../slices/decks";
import { Cards, Decks, Tabletops } from "../types";
import uuid from "@/utils/uuid";
import builtInTemplates from "@/constants/builtInTemplates";
import { createInitStacks } from "@/utils/minStacks";
import text from "@/constants/text";

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
    name: text["deck.new.title"],
    status: "creating",
    cardSize: Decks.CardSize.Poker,
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

  const { stacksIds, stacksById } = createInitStacks();

  const defaultTabletop: Tabletops.Props = {
    id: tabletopId,
    availableDecks: [deckId],
    history: {
      future: [],
      past: [],
      present: {
        cardInstancesById: {},
        stacksById,
        stacksIds,
      },
    },
  };

  return createDeck({
    cards,
    deck,
    defaultTabletop,
  });
}
