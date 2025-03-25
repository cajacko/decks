import { createSelector } from "@reduxjs/toolkit";
import { selectDecks } from "../slices/decks";
import { ReservedDataSchemaIds } from "@/constants/reservedDataSchemaItems";
import { RootState } from "../types";
import { Target } from "@/utils/cardTarget";
import { selectDeckByCard } from "./cards";

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

export const selectDeckId = (state: RootState, props: Target) =>
  props.type === "card"
    ? selectDeckByCard(state, { cardId: props.id })?.id
    : props.id;
