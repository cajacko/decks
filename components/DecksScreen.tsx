import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import CardAction from "./CardAction";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import { ScrollView } from "react-native-gesture-handler";

export interface DecksScreenProps {
  style?: ViewStyle;
}

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const deckIds = useAppSelector(selectDeckIds);
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  const createDeck = React.useCallback(() => {
    const deckId = uuid();

    dispatch(createDeckHelper({ deckId }));

    push(`/deck/${deckId}`);
  }, [push, dispatch]);

  return (
    <ScrollView style={StyleSheet.flatten([props.style, styles.container])}>
      {deckIds.map((deckId) => (
        <DeckListItem key={deckId} deckId={deckId} />
      ))}
      <CardAction icon="+" onPress={createDeck} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
});
