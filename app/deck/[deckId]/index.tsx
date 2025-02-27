import { useLocalSearchParams } from "expo-router";
import React from "react";
import DeckScreen from "@/components/DeckScreen";
import AppError from "@/classes/AppError";
import { StyleSheet } from "react-native";

export default function DeckRoute() {
  const { deckId } = useLocalSearchParams();

  if (typeof deckId !== "string") {
    throw new AppError(`${DeckRoute.name}: deckId must be a string`);
  }

  return <DeckScreen deckId={deckId} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
