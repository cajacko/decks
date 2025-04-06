import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useBuiltInStateSelector } from "@/store/hooks";
import { selectDeckIds } from "@/store/selectors/decks";
import ExpandedDeckListItem, {
  ExpandedDeckListItemSkeleton,
} from "@/components/decks/ExpandedDeckListItem";
import ThemedText from "@/components/ui/ThemedText";
import text from "@/constants/text";
import ContentWidth from "@/components/ui/ContentWidth";
import Skeleton from "../ui/Skeleton";

export interface PreBuiltDecksProps {
  style?: ViewStyle;
  hideTitle?: boolean;
}

function PreBuiltDecksContent({
  style,
  children,
  text,
}: PreBuiltDecksProps & {
  children: React.ReactNode;
  text?: React.ReactNode;
}) {
  return (
    <>
      {text && (
        <ContentWidth padding="standard" style={style}>
          {text}
        </ContentWidth>
      )}
      {children}
    </>
  );
}

export function PreBuiltDecksSkeleton(props: PreBuiltDecksProps) {
  return (
    <PreBuiltDecksContent
      style={props.style}
      text={
        props.hideTitle ? undefined : (
          <Skeleton variant="text" style={styles.title} width={200} />
        )
      }
    >
      <ExpandedDeckListItemSkeleton style={styles.listItem} />
      <ExpandedDeckListItemSkeleton style={styles.listItem} />
      <ExpandedDeckListItemSkeleton style={styles.listItem} />
    </PreBuiltDecksContent>
  );
}

export default function PreBuiltDecks(
  props: PreBuiltDecksProps,
): React.ReactNode {
  const deckIds = useBuiltInStateSelector((state) =>
    selectDeckIds(state, { sortBy: "sortOrder", direction: "asc" }),
  );

  const children = React.useMemo(
    () =>
      deckIds.map((deckId) => (
        <ExpandedDeckListItem
          key={deckId}
          style={styles.listItem}
          deckId={deckId}
        />
      )),
    [deckIds],
  );

  return (
    <PreBuiltDecksContent
      style={props.style}
      text={
        props.hideTitle ? undefined : (
          <ThemedText type="h1" style={styles.title}>
            {text["decks_screen.pre_built_decks.title"]}
          </ThemedText>
        )
      }
    >
      {children}
    </PreBuiltDecksContent>
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
