import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { selectDeckCards } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "./CardSideBySide";
import { DeckCardSizeProvider } from "@/context/Deck";
import IconButton from "./IconButton";
import ThemedText from "./ThemedText";

export interface DeckListItemProps {
  deckId: string;
  style?: ViewStyle;
  skeleton?: boolean;
}

const iconSize = 30;

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { navigate } = useRouter();
  const name = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId: props.deckId })?.name,
    DeckListItem.name,
  );
  const firstDeckCardId = useAppSelector(
    (state) => selectDeckCards(state, { deckId: props.deckId })?.[0]?.cardId,
  );

  const coverTarget = React.useMemo(
    (): Target =>
      firstDeckCardId
        ? { id: firstDeckCardId, type: "card" }
        : { id: props.deckId, type: "deck-defaults" },
    [firstDeckCardId, props.deckId],
  );

  const edit = React.useCallback(() => {
    navigate(`/deck/${props.deckId}`);
  }, [props.deckId, navigate]);

  const play = React.useCallback(() => {
    navigate(`/deck/${props.deckId}/play`);
  }, [props.deckId, navigate]);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.cardConstraints}
    >
      <View style={containerStyle}>
        <Pressable onPress={play} style={styles.cards}>
          <CardSideBySide skeleton={props.skeleton} {...coverTarget} />
        </Pressable>
        <View style={styles.details}>
          <ThemedText type="h3" style={styles.text}>
            {deckNameWithFallback(name)}
          </ThemedText>

          <IconButton
            icon="edit"
            onPress={edit}
            size={iconSize}
            variant="transparent"
          />
        </View>
      </View>
    </DeckCardSizeProvider>
  );
}

const styles = StyleSheet.create({
  cardConstraints: {
    maxHeight: Math.min(200, Dimensions.get("window").height / 3),
    maxWidth: Dimensions.get("window").width - 30,
  },
  container: {
    flex: 1,
    maxWidth: 300,
  },
  cards: {
    position: "relative",
    flex: 1,
  },
  details: {
    zIndex: 2,
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  text: {
    marginRight: 20,
    flex: 1,
  },
});
