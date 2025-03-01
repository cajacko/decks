import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";
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
      <View style={styles.container}>
        <CardSideBySide maxHeight={200} maxWidth={200} {...coverTarget} />
        <Text style={styles.text}>{deckNameWithFallback(name)}</Text>
        <View style={styles.button}>
          <Button title="Play" onPress={play} />
        </View>
        <View style={styles.button}>
          <Button title="Edit" onPress={edit} />
        </View>
      </View>
    </DeckCardSizeProvider>
  );
}

const styles = StyleSheet.create({
  cardConstraints: {
    maxHeight: 200,
  },
  container: {
    flex: 1,
    height: 300,
    padding: 10,
  },
  text: {
    flex: 1,
    fontSize: 20,
    color: "white",
  },
  button: {
    marginVertical: 10,
  },
});
