import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "./CardSideBySide";
import { DeckCardSizeProvider } from "@/context/Deck";

export interface DeckListItemProps {
  deckId: string;
  style?: ViewStyle;
  skeleton?: boolean;
}

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { navigate } = useRouter();
  const firstDeckCardId = useAppSelector(
    (state) => selectDeckCards(state, { deckId: props.deckId })?.[0]?.cardId,
  );

  const coverTarget = React.useMemo(
    (): Target =>
      firstDeckCardId
        ? { id: firstDeckCardId, type: "card" }
        : { id: props.deckId, type: "deck-defaults" },
    [firstDeckCardId, props.deckId],
  );

  const play = React.useCallback(() => {
    navigate(`/deck/${props.deckId}/play`);
  }, [props.deckId, navigate]);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.cardConstraints}
    >
      <View style={containerStyle}>
        <Pressable onPress={play} style={styles.cards}>
          <CardSideBySide
            skeleton={props.skeleton}
            topSide="back"
            {...coverTarget}
          />
        </Pressable>
      </View>
    </DeckCardSizeProvider>
  );
}

const styles = StyleSheet.create({
  cardConstraints: {
    maxHeight: Math.min(200, Dimensions.get("window").height / 3),
    maxWidth: Dimensions.get("window").width - 30,
  },
  container: {
    flex: 1,
    maxWidth: 300,
  },
  cards: {
    position: "relative",
    flex: 1,
  },
});
