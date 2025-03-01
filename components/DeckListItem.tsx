import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import deckNameWithFallback from "@/utils/deckNameWithFallback";

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

  const edit = React.useCallback(() => {
    navigate(`/deck/${props.deckId}`);
  }, [props.deckId, navigate]);

  const play = React.useCallback(() => {
    navigate(`/deck/${props.deckId}/play`);
  }, [props.deckId, navigate]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{deckNameWithFallback(name)}</Text>
      <View style={styles.button}>
        <Button title="Play" onPress={play} />
      </View>
      <View style={styles.button}>
        <Button title="Edit" onPress={edit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 200,
    height: 300,
    padding: 10,
  },
  text: {
    flex: 1,
    fontSize: 20,
  },
  button: {
    marginVertical: 10,
  },
});
