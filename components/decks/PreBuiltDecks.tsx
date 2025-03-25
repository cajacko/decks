import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useBuiltInStateSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import ExpandedDeckListItem from "@/components/decks/ExpandedDeckListItem";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import ThemedText from "@/components/ui/ThemedText";
import text from "@/constants/text";
import ContentWidth from "@/components/ui/ContentWidth";

export interface PreBuiltDecksProps {
  style?: ViewStyle;
}

export default function PreBuiltDecks(
  props: PreBuiltDecksProps,
): React.ReactNode {
  const skeleton = useScreenSkeleton(PreBuiltDecks.name);
  const deckIds = useBuiltInStateSelector(selectDeckIds);

  const children = React.useMemo(
    () =>
      deckIds.map((deckId) => (
        <ExpandedDeckListItem
          key={deckId}
          style={styles.listItem}
          deckId={deckId}
          skeleton={deckId ? skeleton : false}
        />
      )),
    [deckIds, skeleton],
  );

  return (
    <>
      <ContentWidth padding="standard" style={props.style}>
        <ThemedText type="h1" style={styles.title}>
          {text["decks_screen.pre_built_decks.title"]}
        </ThemedText>
      </ContentWidth>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  listItem: {
    paddingVertical: 20,
    flex: 1,
  },
});
