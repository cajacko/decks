import React from "react";
import {
  StyleSheet,
  FlatList,
  ViewStyle,
  View,
  FlatListProps,
  Dimensions,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import IconButton from "./IconButton";
import { useRouter } from "expo-router";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";

export interface DecksScreenProps {
  style?: ViewStyle;
}

type FlatListItem = string;

const extractKey: (item: FlatListItem) => string = (item) => item;

const initialRows = 4;
export const maxWidth = 1000;

export default function DecksScreen(props: DecksScreenProps): React.ReactNode {
  const skeleton = useScreenSkeleton(DecksScreen.name);
  const deckIdsState = useAppSelector(selectDeckIds);
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const numColumns = React.useRef(
    Math.max(
      Math.round(Math.min(Dimensions.get("window").width, maxWidth) / 400),
      2,
    ),
  );

  const deckIds = React.useMemo(
    () =>
      skeleton
        ? deckIdsState.slice(0, initialRows * numColumns.current)
        : deckIdsState,
    [deckIdsState, skeleton, numColumns],
  );

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

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <>
      {!skeleton && (
        <View style={containerStyle}>
          <FlatList<FlatListItem>
            contentContainerStyle={styles.contentContainer}
            style={styles.list}
            data={deckIds}
            renderItem={renderItem}
            keyExtractor={extractKey}
            numColumns={numColumns.current}
            initialNumToRender={initialRows * numColumns.current}
            columnWrapperStyle={styles.columnWrapper}
          />
          <IconButton icon="add" onPress={createDeck} style={styles.action} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  list: {
    maxWidth: maxWidth,
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  listItem: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: "100%",
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 150,
    // alignItems: "center",
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
