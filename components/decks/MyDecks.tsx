import React from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/selectors/decks";
import DeckListItem, {
  DeckListItemSkeleton,
} from "@/components/decks/DeckListItem";
import Skeleton from "@/components/ui/Skeleton";
import ThemedText from "../ui/ThemedText";
import text from "@/constants/text";
import ContentWidth, {
  styles as contentWidthStyles,
} from "@/components/ui/ContentWidth";
import { ScrollView } from "react-native-gesture-handler";

export interface MyDecksProps {
  style?: ViewStyle;
}

type FlatListItem = string | null;

function MyDecksContent({
  style,
  children,
  text,
}: Pick<MyDecksProps, "style"> & {
  children: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <View style={style}>
      <ContentWidth padding="standard">
        <View style={styles.title}>{text}</View>
      </ContentWidth>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        horizontal
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function MyDecksSkeleton({
  style,
}: Partial<MyDecksProps>): React.ReactNode {
  return (
    <MyDecksContent
      style={style}
      text={<Skeleton variant="text" width={200} />}
    >
      <DeckListItemSkeleton style={styles.listItem} />
      <DeckListItemSkeleton style={styles.listItem} />
      <DeckListItemSkeleton style={styles.listItem} />
      <DeckListItemSkeleton style={styles.listItem} />
      <DeckListItemSkeleton style={styles.listItem} />
    </MyDecksContent>
  );
}

export default function MyDecks({ style }: MyDecksProps): React.ReactNode {
  const deckIdsState = useAppSelector(selectDeckIds);

  const deckIds = React.useMemo((): FlatListItem[] => {
    return [...deckIdsState, null];
  }, [deckIdsState]);

  const children = React.useMemo(
    () =>
      deckIds.map((deckId) => (
        <DeckListItem key={deckId} style={styles.listItem} deckId={deckId} />
      )),
    [deckIds],
  );

  return (
    <MyDecksContent
      style={style}
      text={
        <ThemedText type="h1">{text["decks_screen.my_decks.title"]}</ThemedText>
      }
    >
      {children}
    </MyDecksContent>
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
