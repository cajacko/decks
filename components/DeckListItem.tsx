import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { useRouter } from "expo-router";

export interface DeckListItemProps {
  deckId: string;
}

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { push } = useRouter();

  const name = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId: props.deckId })?.name,
    DeckListItem.name,
  );

  const edit = React.useCallback(() => {
    push(`/deck/${props.deckId}`);
  }, [props.deckId, push]);

  const play = React.useCallback(() => {
    push(`/deck/${props.deckId}/play`);
  }, [props.deckId, push]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
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
