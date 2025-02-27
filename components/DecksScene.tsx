import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";

export interface DecksSceneProps {
  style?: ViewStyle;
}

export default function DecksScene(props: DecksSceneProps): React.ReactNode {
  const deckIds = useAppSelector(selectDeckIds);

  return (
    <View style={StyleSheet.flatten([props.style, styles.container])}>
      {deckIds.map((deckId) => (
        <DeckListItem key={deckId} deckId={deckId} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
});
