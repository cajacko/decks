import { StyleSheet } from "react-native";
import Tabletop from "@/components/Tabletop/Tabletop";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import AppError from "@/classes/AppError";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckTabletopScreen() {
  const params = useLocalSearchParams();
  const deckId = params[paramKeys.deckId];

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckTabletopScreen.name} deckId must be a string`);
  }

  const defaultTabletopId = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId })?.defaultTabletopId,
    DeckTabletopScreen.name,
  );

  return <Tabletop tabletopId={defaultTabletopId} style={styles.tabletop} />;
}

const styles = StyleSheet.create({
  tabletop: {
    flex: 1,
  },
});
