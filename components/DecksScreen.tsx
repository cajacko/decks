import React from "react";
import { StyleSheet, FlatList, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";

export interface DecksScreenProps {
  style?: ViewStyle;
}

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const deckIds = useAppSelector(selectDeckIds);
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const createDeck = React.useCallback(() => {
    const deckId = uuid();

    dispatch(createDeckHelper({ deckId }));

    navigate(`/deck/${deckId}`);
  }, [navigate, dispatch]);

  return (
    <>
      <FlatList
        style={StyleSheet.flatten([props.style, styles.container])}
        contentContainerStyle={styles.contentContainer}
        data={deckIds}
        renderItem={({ item }) => <DeckListItem deckId={item} />}
        keyExtractor={(deckId) => deckId}
        numColumns={2}
      />
      <IconButton icon="+" onPress={createDeck} style={styles.action} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 200,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
