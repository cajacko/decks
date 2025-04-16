import React from "react";
import { Slot } from "expo-router";
import { selectCanEditDeck } from "@/store/selectors/decks";
import text from "@/constants/text";
import { useAppSelector } from "@/store/hooks";
import { StyleSheet, View } from "react-native";
import Tabs, { Tab } from "@/components/ui/Tabs";
import { useNavigation } from "@/context/Navigation";

export default function DeckLayout() {
  const { navigate, screen, preloadDeckId } = useNavigation();
  const deckId = screen.deckId || preloadDeckId;
  const canEditDeck = useAppSelector((state) =>
    deckId ? selectCanEditDeck(state, { deckId }) : false,
  );
  const isPlay = useNavigation().screen.name === "play";

  const onPressDeck = React.useCallback(() => {
    if (!deckId) return;

    navigate({
      name: "deck",
      deckId,
    });
  }, [deckId, navigate]);

  const onPressPlay = React.useCallback(() => {
    if (!deckId) return;

    navigate({
      name: "play",
      deckId,
    });
  }, [deckId, navigate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <Tabs style={styles.tabs}>
        <Tab
          onPress={onPressDeck}
          icon={canEditDeck ? "edit-document" : "remove-red-eye"}
          title={
            canEditDeck
              ? text["screen.deck.index.title"]
              : text["screen.deck.view.title"]
          }
          isActive={!isPlay}
        />
        <Tab
          onPress={onPressPlay}
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
