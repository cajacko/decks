import React from "react";
import DeckScreen from "@/components/DeckScreen";
import { StyleSheet } from "react-native";
import TextureBackground from "@/components/TextureBackground";
import Screen from "@/components/Screen";
import useScreenDeckId from "@/hooks/useScreenDeckId";

export default function DeckRoute() {
  const deckId = useScreenDeckId("screen", DeckRoute.name);

  if (!deckId) {
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
