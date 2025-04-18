import React from "react";
import DeckScreen, { DeckScreenSkeleton } from "@/components/decks/DeckScreen";
import { StyleSheet } from "react-native";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import { useNavigation } from "@/context/Navigation";

export default function DeckRoute() {
  const { screen, preloadDeckId } = useNavigation();
  const deckId = screen.deckId || preloadDeckId;

  return (
    <Screen background={<TextureBackground />}>
      {deckId ? (
        <DeckScreen deckId={deckId} style={styles.container} />
      ) : (
        <DeckScreenSkeleton style={styles.container} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
