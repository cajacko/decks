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
import { dateToDateString } from "@/utils/dates";

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

  return updateCard({ ...props, deckId, date: dateToDateString(new Date()) });
}

export function deleteCardHelper(props: {
  cardId: Cards.Id;
  deckId?: Decks.Id;
  tabletopIds?: Tabletops.Id[];
}) {
  const deckId =
    props.deckId ?? selectCard(store.getState(), props)?.deckId ?? null;

  return deleteCard({
    cardId: props.cardId,
    deckId,
    date: dateToDateString(new Date()),
  });
}

export function createCardHelper(props: {
  cardId: Cards.Id;
  deckId: Decks.Id;
  data: SetCardData;
}) {
  const tabletops: CreateCardActionPayload["tabletops"] = [];
  const defaultTabletopId = selectDeck(
    store.getState(),
    props,
  )?.defaultTabletopId;

  // NOTE: The tabletop reducer decides whether to add the card instance or not and where based on
  // it's settings, we don't need to do that here
  if (defaultTabletopId) {
    tabletops.push({
      tabletopId: defaultTabletopId,
      cardInstances: [
        {
          cardId: props.cardId,
          cardInstanceId: uuid(),
        },
      ],
    });
  }

  return createCard({
    ...props,
    tabletops,
    date: dateToDateString(new Date()),
  });
}
