import { useGlobalSearchParams } from "expo-router";
import React from "react";
import DeckScreen from "@/components/DeckScreen";
import AppError from "@/classes/AppError";
import { StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import TextureBackground from "@/components/TextureBackground";
import Screen from "@/components/Screen";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckRoute() {
  const params = useGlobalSearchParams();
  const deckIdParam = params[paramKeys.deckId];
  const deckId = typeof deckIdParam === "string" ? deckIdParam : null;
  const navigation = useNavigation();

  if (!deckId) {
    if (navigation.isFocused()) {
      new AppError(`${DeckRoute.name}: deckId must be a string`).log("error");
    }

    return null;
  }

  return (
    <Screen background={<TextureBackground />}>
      <DeckScreen deckId={deckId} style={styles.container} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
