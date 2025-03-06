import React from "react";
import {
  StyleSheet,
  FlatList,
  ViewStyle,
  View,
  FlatListProps,
  Dimensions,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import ThemedText from "./ThemedText";
import text from "@/constants/text";

export interface MyDecksProps {
  style?: ViewStyle;
}

type FlatListItem = string | null;

const extractKey: (item: FlatListItem) => string = (item) => item ?? "new-deck";

const initialRows = 4;
export const maxWidth = 1000;

export default function MyDecks(props: MyDecksProps): React.ReactNode {
  const skeleton = useScreenSkeleton(MyDecks.name);
  const deckIdsState = useAppSelector(selectDeckIds);

  const numColumns = React.useRef(
    Math.max(
      Math.round(Math.min(Dimensions.get("window").width, maxWidth) / 400),
      2,
    ),
  );

  const deckIds = React.useMemo((): FlatListItem[] => {
    const slicedDecks = skeleton
      ? deckIdsState.slice(0, initialRows * numColumns.current)
      : deckIdsState;

    // Add the "create new deck to the end"
    return [...slicedDecks, null];
  }, [deckIdsState, skeleton, numColumns]);

  const renderItem = React.useCallback<
    NonNullable<FlatListProps<FlatListItem>["renderItem"]>
  >(
    ({ item }) => (
      <DeckListItem
        style={styles.listItem}
        deckId={item}
        skeleton={item ? skeleton : false}
      />
    ),
    [skeleton],
  );

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <View style={containerStyle}>
      <ThemedText type="h1" style={styles.title}>
        {text["decks_screen.my_decks.title"]}
      </ThemedText>
      {!skeleton && (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  columnWrapper: {
    justifyContent: "center",
  },
  list: {
    maxWidth: maxWidth,
    width: "100%",
  },
  title: {
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
});
