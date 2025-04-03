import React from "react";
import DeckScreen from "@/components/decks/DeckScreen";
import { StyleSheet } from "react-native";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import useScreenDeckId from "@/hooks/useScreenDeckId";
import { useScreenContentLayout } from "@/context/ScreenContentLayout";

export default function DeckRoute() {
  const deckId = useScreenDeckId("screen", DeckRoute.name);
  const { width } = useScreenContentLayout();

  if (!deckId) {
    return null;
  }

  return (
    <Screen background={<TextureBackground />}>
      <DeckScreen width={width} deckId={deckId} style={styles.container} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
