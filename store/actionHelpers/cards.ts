import { Cards, Decks, Tabletops } from "../types";
import AppError from "@/classes/AppError";
import { selectCard } from "../slices/cards";
import {
  updateCard,
  deleteCard,
  createCard,
  CreateCardActionPayload,
} from "../combinedActions/cards";
import { store } from "../store";
import { SetCardData } from "../combinedActions/types";
import uuid from "@/utils/uuid";
import { selectDeck } from "../slices/decks";

export function updateCardHelper(props: {
  cardId: Cards.Id;
  data: SetCardData;
  deckId?: Decks.Id;
}) {
  const deckId = props.deckId ?? selectCard(store.getState(), props)?.deckId;

  if (!deckId) {
    throw new AppError(
      `${updateCardHelper.name}: Deck not found for card ${props.cardId}`,
    );
  }

  return updateCard({ ...props, deckId });
}

export function deleteCardHelper(props: {
  cardId: Cards.Id;
  deckId?: Decks.Id;
  tabletopIds?: Tabletops.Id[];
}) {
  const deckId =
    props.deckId ?? selectCard(store.getState(), props)?.deckId ?? null;

  return deleteCard({ cardId: props.cardId, deckId });
}

export function createCardHelper(props: {
  cardId: Cards.Id;
  deckId: Decks.Id;
  data: SetCardData;
}) {
  const tabletops: CreateCardActionPayload["tabletops"] = [];
  const deck = selectDeck(store.getState(), props)?.defaultTabletopId;

  if (deck) {
    tabletops.push({
      tabletopId: deck,
      cardInstances: [
        {
          cardId: props.cardId,
          cardInstanceId: uuid(),
          side: "front",
        },
      ],
    });
  }

  return createCard({ ...props, tabletops });
}
