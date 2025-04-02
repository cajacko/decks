import React from "react";
import { Slot, useSegments } from "expo-router";
import { selectCanEditDeck } from "@/store/slices/decks";
import text from "@/constants/text";
import { useAppSelector } from "@/store/hooks";
import useScreenDeckId from "@/hooks/useScreenDeckId";
import { StyleSheet, View } from "react-native";
import Tabs, { Tab } from "@/components/ui/Tabs";

export default function DeckLayout() {
  const deckId = useScreenDeckId("layout", null);
  const canEditDeck = useAppSelector((state) =>
    deckId ? selectCanEditDeck(state, { deckId }) : false,
  );

  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const isPlay = lastSegment === "play";

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <Tabs style={styles.tabs}>
        <Tab
          href={`/deck/${deckId}`}
          icon={canEditDeck ? "edit-document" : "remove-red-eye"}
          title={
            canEditDeck
              ? text["screen.deck.index.title"]
              : text["screen.deck.view.title"]
          }
          isActive={!isPlay}
        />
        <Tab
          href={`/deck/${deckId}/play`}
          icon="play-arrow"
          title={text["screen.deck.play.title"]}
          isActive={isPlay}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
});
