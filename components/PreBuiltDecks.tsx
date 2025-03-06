import React from "react";
import { StyleSheet, ViewStyle, View, ScrollView } from "react-native";
import { useBuiltInStateSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/slices/decks";
import ExpandedDeckListItem from "@/components/ExpandedDeckListItem";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import ThemedText from "./ThemedText";
import text from "@/constants/text";

export interface PreBuiltDecksProps {
  style?: ViewStyle;
}

export default function PreBuiltDecks(
  props: PreBuiltDecksProps,
): React.ReactNode {
  const skeleton = useScreenSkeleton(PreBuiltDecks.name);
  const deckIds = useBuiltInStateSelector(selectDeckIds);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

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
    <View style={containerStyle}>
      <ThemedText type="h1" style={styles.title}>
        {text["decks_screen.pre_built_decks.title"]}
      </ThemedText>
      {!skeleton && (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {children}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 600,
    width: "100%",
  },
  list: {},
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
