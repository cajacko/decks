import { deleteDeck, createDeck } from "../combinedActions/decks";
import { store } from "../store";
import { selectDeck } from "../slices/decks";
import { Cards, Decks, Tabletops } from "../types";
import uuid from "@/utils/uuid";
import builtInTemplates from "@/constants/builtInTemplates";
import { createInitStacks } from "@/utils/minStacks";
import text, { TextKey } from "@/constants/text";
import { selectTabletop } from "../slices/tabletop";
import { getBuiltInState } from "../utils/withBuiltInState";
import { selectCard } from "../slices/cards";
import { ReservedDataSchemaIds } from "@/constants/reservedDataSchemaItems";
import {
  selectDeckDefaultColors,
  selectDeckNames,
} from "../combinedSelectors/decks";
import pickLeastUsedColor from "@/utils/pickLeastUsedColor";
import { fixed } from "@/constants/colors";

export function deleteDeckHelper(props: {
  deckId: Decks.Id;
  cardIds?: Cards.Id[];
  tabletopId?: Tabletops.Id;
}) {
  const deck = selectDeck(store.getState(), props);

  const cardIds: Cards.Id[] =
    props.cardIds ?? deck?.cards.map(({ cardId }) => cardId) ?? [];

  const tabletopId = deck?.defaultTabletopId ?? props.tabletopId ?? null;

  return deleteDeck({ cardIds, deckId: props.deckId, tabletopId });
}

type ValidNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ValidatedTextKey<K extends TextKey> = K;
type UnvalidatedTextKey<T extends number = number> =
  `deck.new.title.append.${T}`;
// This validates that our appended key is an actual TextKey
export type Test = ValidatedTextKey<UnvalidatedTextKey<ValidNumbers>>;

function getNewDeckNameAppend(
  textMap: Record<string, string | undefined>,
  i: number,
): string | null {
  const key: UnvalidatedTextKey = `deck.new.title.append.${i}`;

  return textMap[key] ?? null;
}

export function createDeckHelper({ deckId }: { deckId: Decks.Id }) {
  const tabletopId = uuid();
  const deckDefaultColors = selectDeckDefaultColors(store.getState());
  const deckNames = selectDeckNames(store.getState());

  let deckName = text["deck.new.title"];
  let i = 0;
  let copy = 1;

  while (deckNames.includes(deckName)) {
    const newDeckNameAppend = getNewDeckNameAppend(text, i);

    if (newDeckNameAppend) {
      deckName = `${text["deck.new.title"]}${newDeckNameAppend}`;

      i += 1;
    } else {
      deckName = `${deckName} (${copy})`;

      copy += 1;
    }
  }

  const color = pickLeastUsedColor({
    availableColors: fixed.cardPresets.smartNewDeckColors,
    usedColors: deckDefaultColors,
    fallback: fixed.cardPresets.newDeck,
  });

  const deck: Decks.Props = {
    id: deckId,
    cards: [],
    dataSchema: {
      [ReservedDataSchemaIds.Color]: {
        id: ReservedDataSchemaIds.Color,
        type: "color",
        defaultValidatedValue: {
          type: "color",
          value: color,
        },
      },
    },
    dataSchemaOrder: [],
    defaultTabletopId: tabletopId,
    name: deckName,
    description: text["deck.new.description"],
    status: "creating",
    canEdit: true,
    cardSize: Cards.Size.Poker,
    templates: {
      back: {
        dataTemplateMapping: {
          [builtInTemplates.back.schema.color.id]: {
            dataId: ReservedDataSchemaIds.Color,
            templateDataId: builtInTemplates.back.schema.color.id,
          },
        },
        templateId: builtInTemplates.back.templateId,
      },
      front: {
        dataTemplateMapping: {
          [builtInTemplates.front.schema.color.id]: {
            dataId: ReservedDataSchemaIds.Color,
            templateDataId: builtInTemplates.front.schema.color.id,
          },
        },
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

export function copyDeckHelper(props: {
  deckId: Decks.Id;
  newDeckId: Decks.Id;
}) {
  const deckToCopy = selectDeck(store.getState(), props);

  const deckId = props.newDeckId;

  if (!deckToCopy) {
    return createDeckHelper({ deckId });
  }

  const tabletopId = uuid();
  const cardIdMap = new Map<Cards.Id, Cards.Id>();

  const cards: Cards.Props[] = [];
  const deckCards: Decks.Card[] = [];

  function copyCard(existingCardId: Cards.Id): Cards.Id | null {
    const existingCard = selectCard(store.getState(), {
      cardId: existingCardId,
    });

    if (!existingCard) return null;

    const newCardId = uuid();

    cardIdMap.set(existingCardId, newCardId);

    cards.push({
      templates: existingCard.templates,
      cardId: newCardId,
      data: existingCard.data,
      canEdit: true,
      deckId,
      status: "creating",
    });

    return newCardId;
  }

  deckToCopy.cards.forEach(({ cardId, quantity }) => {
    const newCardId = copyCard(cardId);

    if (!newCardId) return;

    deckCards.push({
      cardId: newCardId,
      quantity,
    });
  });

  const existingTabletop = deckToCopy.defaultTabletopId
    ? selectTabletop(store.getState(), {
        tabletopId: deckToCopy.defaultTabletopId,
      })
    : selectTabletop(getBuiltInState(), {
        tabletopId: deckToCopy.defaultTabletopId,
      });

  let defaultTabletop: Tabletops.Props;

  if (existingTabletop) {
    const cardInstancesById: Tabletops.CardInstancesById = {};

    Object.entries(existingTabletop.history.present.cardInstancesById).forEach(
      ([cardInstanceId, cardInstance]) => {
        if (!cardInstance) return;

        let newCardId: Cards.Id;

        const mappedCardId = cardIdMap.get(cardInstance.cardId);

        if (mappedCardId) {
          newCardId = mappedCardId;
        } else {
          const _newCardId = copyCard(cardInstance.cardId);

          if (!_newCardId) return;

          newCardId = _newCardId;
        }

        cardInstancesById[cardInstanceId] = {
          cardId: newCardId,
          side: cardInstance.side,
          // The id is local to the tabletop, so we don't need to change it
          cardInstanceId,
        };
      },
    );

    defaultTabletop = {
      history: {
        future: [],
        past: [],
        present: {
          cardInstancesById,
          stacksById: existingTabletop.history.present.stacksById,
          stacksIds: existingTabletop.history.present.stacksIds,
        },
      },
      id: tabletopId,
      availableDecks: [deckId],
    };
  } else {
    const { stacksIds, stacksById } = createInitStacks();

    defaultTabletop = {
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
  }

  // NOTE: Don't spread, it will force us to add in all new props and choose what we need
  const deck: Decks.Props = {
    cards: deckCards,
    cardSize: deckToCopy.cardSize,
    dataSchema: deckToCopy.dataSchema,
    dataSchemaOrder: deckToCopy.dataSchemaOrder,
    templates: deckToCopy.templates,
    name: `${deckToCopy.name}${text["deck.copied.append"]}`,
    description: deckToCopy.description,
    id: deckId,
    defaultTabletopId: tabletopId,
    status: "creating",
    canEdit: true,
  };

  return createDeck({
    cards,
    deck,
    defaultTabletop,
  });
}
