import React from "react";
import {
  StyleSheet,
  FlatList,
  ViewStyle,
  View,
  FlatListProps,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
// import exampleDecksToStore from "@/utils/exampleDecksToStore";
// import { SliceName } from "@/store/types";

export interface DecksScreenProps {
  style?: ViewStyle;
}

type FlatListItem = string;

const extractKey: (item: FlatListItem) => string = (item) => item;

const initialRows = 4;

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  let skeleton = true;
  const numColumns = 2;
  const deckIdsState = useAppSelector(selectDeckIds);
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const deckIds = React.useMemo(
    () =>
      skeleton ? deckIdsState.slice(0, initialRows * numColumns) : deckIdsState,
    [deckIdsState, skeleton, numColumns],
  );

  // const allDeckIds = React.useMemo(
  //   () => [...deckIds, ...exampleDecksToStore()[SliceName.Decks].deckIds],
  //   [deckIds],
  // );

  const createDeck = React.useCallback(() => {
    const deckId = uuid();

    dispatch(createDeckHelper({ deckId }));

    navigate(`/deck/${deckId}`);
  }, [navigate, dispatch]);

  const renderItem = React.useCallback<
    NonNullable<FlatListProps<FlatListItem>["renderItem"]>
  >(
    ({ item }) => (
      <DeckListItem style={styles.listItem} deckId={item} skeleton={skeleton} />
    ),
    [skeleton],
  );

  return (
    <>
      <View style={props.style}>
        <FlatList<FlatListItem>
          contentContainerStyle={styles.contentContainer}
          data={deckIds}
          renderItem={renderItem}
          keyExtractor={extractKey}
          numColumns={numColumns}
          initialNumToRender={initialRows * numColumns}
        />
        <IconButton icon="add" onPress={createDeck} style={styles.action} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
    color: "white",
  },
  listItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  contentContainer: {
    paddingBottom: 150,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
