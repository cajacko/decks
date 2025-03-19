import React from "react";
import { StyleSheet, ViewStyle, View, ScrollView } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import DeckListItem from "@/components/DeckListItem";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import ThemedText from "./ThemedText";
import text from "@/constants/text";
import ContentWidth, {
  styles as contentWidthStyles,
} from "@/components/ContentWidth";

export interface MyDecksProps {
  style?: ViewStyle;
}

type FlatListItem = string | null;

export default function MyDecks(props: MyDecksProps): React.ReactNode {
  const skeleton = useScreenSkeleton(MyDecks.name);
  const deckIdsState = useAppSelector(selectDeckIds);

  const deckIds = React.useMemo((): FlatListItem[] => {
    return [...deckIdsState, null];
  }, [deckIdsState]);

  const children = React.useMemo(
    () =>
      deckIds.map((deckId) => (
        <DeckListItem
          key={deckId}
          style={styles.listItem}
          deckId={deckId}
          skeleton={deckId ? skeleton : false}
        />
      )),
    [deckIds, skeleton],
  );

  return (
    <View style={props.style}>
      <ContentWidth padding="standard">
        <ThemedText type="h1" style={styles.title}>
          {text["decks_screen.my_decks.title"]}
        </ThemedText>
      </ContentWidth>
      {!skeleton && (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          horizontal
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  listContent: {
    ...contentWidthStyles.standardPadding,
    justifyContent: "center",
    minWidth: "100%",
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
});
