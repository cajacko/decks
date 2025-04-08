import React from "react";
import {
  StyleProp,
  ViewStyle,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import ThemedView from "../ui/ThemedView";
import CardSideBySide from "../cards/connected/CardSideBySide";
import { useCoverCardTarget } from "./ExpandedDeckListItem";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/selectors/decks";
import ThemedText from "../ui/ThemedText";
import text from "@/constants/text";
import Tabs, { Tab } from "../ui/Tabs";
import { CardConstraintsProvider } from "../cards/context/CardSizeConstraints";
import { styles as contentWidthStyles } from "../ui/ContentWidth";

export interface DeckInfoProps {
  deckId: string;
  style?: StyleProp<ViewStyle>;
  showTabs?: boolean;
}

export default function DeckInfo({
  deckId,
  style,
  showTabs = true,
}: DeckInfoProps): React.ReactNode {
  const target = useCoverCardTarget(deckId);
  const deck = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId }),
    selectDeck.name,
  );

  return (
    <ThemedView style={[styles.container, style]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <CardConstraintsProvider width={100}>
            <CardSideBySide target={target} topSide="front" />
          </CardConstraintsProvider>
          <View style={styles.textContainer}>
            <ThemedText type="h2" style={styles.text}>
              {deck.name}
            </ThemedText>
            {/* <ThemedText type="h2">
              {text["deck.edit.instructions.label"]}
            </ThemedText> */}
            <ThemedText type="body1">{deck.description}</ThemedText>
          </View>
        </View>

        {showTabs && (
          <Tabs>
            <Tab
              href={`/deck/${deckId}/play`}
              icon="play-arrow"
              title={text["screen.deck.play.title"]}
              isActive={false}
            />
            <Tab
              href={`/deck/${deckId}`}
              icon="remove-red-eye"
              title={text["screen.deck.index.title"]}
              isActive={false}
            />
          </Tabs>
        )}
      </ScrollView>
    </ThemedView>
  );
}

export const styles = StyleSheet.create({
  modalContainer: {
    padding: contentWidthStyles.standardPadding.paddingHorizontal,
  },
  modalContent: {
    width: "100%",
    maxWidth: 600,
    maxHeight: 400,
    flex: 1,
  },
  container: {},
  scrollView: {
    flex: 1,
  },
  content: {
    flexDirection: "row",
  },
  textContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  text: {
    marginBottom: 10,
  },
});
