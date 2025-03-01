import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Button,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { selectDeckCards } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "./CardSideBySide";
import { DeckCardSizeProvider } from "@/context/Deck";

export interface DeckListItemProps {
  deckId: string;
  style?: ViewStyle;
}

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { navigate } = useRouter();
  const name = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId: props.deckId })?.name,
    DeckListItem.name,
  );
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

  const edit = React.useCallback(() => {
    navigate(`/deck/${props.deckId}`);
  }, [props.deckId, navigate]);

  const play = React.useCallback(() => {
    navigate(`/deck/${props.deckId}/play`);
  }, [props.deckId, navigate]);

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.cardConstraints}
    >
      <View style={[styles.container, props.style]}>
        <Pressable onPress={play} style={styles.cards}>
          <CardSideBySide {...coverTarget} />
        </Pressable>
        <View style={styles.details}>
          <Text style={styles.text}>{deckNameWithFallback(name)}</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button title="Play" onPress={play} />
            </View>
            <View style={styles.button}>
              <Button title="Edit" onPress={edit} />
            </View>
          </View>
        </View>
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
  },
  cards: {
    position: "relative",
    flex: 1,
  },
  details: {
    zIndex: 2,
  },
  text: {
    flex: 1,
    fontSize: 20,
    color: "white",
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
});
