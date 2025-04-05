import { createSelector } from "@reduxjs/toolkit";
import { ReservedDataSchemaIds } from "@/constants/reservedDataSchemaItems";
import { RootState, Decks } from "../types";
import withBuiltInState, {
  selectBuiltInState,
} from "../utils/withBuiltInState";

export const selectDecksById = (state: RootState): Decks.State["decksById"] =>
  state.decks.decksById;

export const selectDeck = withBuiltInState(
  (state: RootState, props: { deckId: string }): Decks.Props | undefined =>
    selectDecksById(state)[props.deckId],
);

export const selectDeckIds = createSelector(
  selectDecksById,
  (
    _: RootState,
    props?: {
      sortBy?: "dateUpdated" | "dateCreated" | "sortOrder";
      direction?: "asc" | "desc";
    },
  ) => props?.sortBy,
  (
    _: RootState,
    props?: {
      sortBy?: "dateUpdated" | "dateCreated" | "sortOrder";
      direction?: "asc" | "desc";
    },
  ) => props?.direction,
  (decksById, sortBy = "dateUpdated", _direction): Decks.Id[] => {
    const defaultDirection = sortBy === "sortOrder" ? "asc" : "desc";
    const direction = _direction ?? defaultDirection;
    const deckIds: Decks.Id[] = [];

    Object.values(decksById)
      .sort((a, b): number => {
        if (!a || !b) return 0;

        switch (sortBy) {
          case "dateCreated":
          case "dateUpdated": {
            const aDate = new Date(
              sortBy === "dateCreated" ? a.dateCreated : a.dateUpdated,
            );

            const bDate = new Date(
              sortBy === "dateCreated" ? b.dateCreated : b.dateUpdated,
            );

            if (direction === "asc") {
              return aDate.getTime() - bDate.getTime();
            }

            return bDate.getTime() - aDate.getTime();
          }
          case "sortOrder": {
            if (a.sortOrder === undefined || b.sortOrder === undefined) {
              return 0;
            }

            if (direction === "asc") {
              return a.sortOrder - b.sortOrder;
            }

            return b.sortOrder - a.sortOrder;
          }
        }
      })
      .forEach((deck) => {
        if (!deck) return;
        if (deck.dateDeleted) return;

        deckIds.push(deck.id);
      });

    return deckIds;
  },
);

export const selectDecks = createSelector(
  selectDeckIds,
  selectDecksById,
  (deckIds, decksById) => {
    const decks: Decks.Props[] = [];

    for (const deckId of deckIds) {
      const deck = decksById[deckId];

      if (deck) {
        decks.push(deck);
      }
    }

    return decks;
  },
);

export const selectDeckCards = (
  state: RootState,
  props: { deckId: string },
): Decks.Card[] | undefined => selectDeck(state, props)?.cards;

export const selectDeckLastScreen = (
  state: RootState,
  props: { deckId: string },
): "deck" | "play" | undefined => selectDeck(state, props)?.lastScreen;

export const selectBuiltInDeckIds = (state: RootState) =>
  selectDeckIds(selectBuiltInState(state));

export const selectCanEditDeck = (
  state: RootState,
  props: { deckId: string },
): boolean => selectDeck(state, props)?.canEdit ?? false;

export const selectDeckDefaultColors = createSelector(selectDecks, (decks) => {
  const colors: string[] = [];

  for (const deck of decks) {
    const validatedValue =
      deck.dataSchema?.[ReservedDataSchemaIds.Color]?.defaultValidatedValue;

    if (validatedValue && validatedValue.type === "color") {
      colors.push(validatedValue.value);
    }
  }

  return colors;
});

export const selectDeckNames = createSelector(selectDecks, (decks) => {
  const names: string[] = [];

  for (const deck of decks) {
    names.push(deck.name);
  }

  return names;
});
