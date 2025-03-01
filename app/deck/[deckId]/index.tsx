import { useGlobalSearchParams } from "expo-router";
import React from "react";
import DeckScreen from "@/components/DeckScreen";
import AppError from "@/classes/AppError";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckRoute() {
  const params = useGlobalSearchParams();
  const deckId = params[paramKeys.deckId];
  const navigation = useNavigation();

  if (typeof deckId !== "string") {
    if (navigation.isFocused()) {
      new AppError(`${DeckRoute.name}: deckId must be a string`).log("error");
    }

    return null;
  }

  return <DeckScreen deckId={deckId} style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
