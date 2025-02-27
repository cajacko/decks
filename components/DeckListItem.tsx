import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
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

  const onPress = React.useCallback(() => {
    push(`/deck/${props.deckId}/tabletop`);
  }, [props.deckId, push]);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 100,
    height: 100,
  },
});
