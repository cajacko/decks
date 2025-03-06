import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ViewStyle,
} from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckCards, selectDeckLastScreen } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "./CardSideBySide";
import { DeckCardSizeProvider } from "@/context/Deck";
import { CardSizeProvider } from "@/components/Card/CardSize.context";
import { defaultCardDimensions } from "@/constants/cardDimensions";
import { newDeckCardTarget } from "@/constants/newDeckData";
import uuid from "@/utils/uuid";
import { createDeckHelper } from "@/store/actionHelpers/decks";

export interface DeckListItemProps {
  deckId: string | null;
  style?: ViewStyle;
  skeleton?: boolean;
}

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const firstDeckCardId = useAppSelector((state) =>
    props.deckId
      ? selectDeckCards(state, { deckId: props.deckId })?.[0]?.cardId
      : null,
  );
  const lastScreen = useAppSelector((state) =>
    props.deckId ? selectDeckLastScreen(state, { deckId: props.deckId }) : null,
  );

  const coverTarget = React.useMemo((): Target | null => {
    if (!props.deckId) {
      return null;
    }

    return firstDeckCardId
      ? { id: firstDeckCardId, type: "card" }
      : { id: props.deckId, type: "deck-defaults" };
  }, [firstDeckCardId, props.deckId]);

  const onPress = React.useCallback(() => {
    if (!props.deckId) {
      const deckId = uuid();

      dispatch(createDeckHelper({ deckId }));

      navigate(`/deck/${deckId}`);

      return;
    }

    navigate(
      lastScreen === "deck"
        ? `/deck/${props.deckId}`
        : `/deck/${props.deckId}/play`,
    );
  }, [props.deckId, navigate, lastScreen, dispatch]);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  let cards: React.ReactNode;

  if (coverTarget) {
    cards = (
      <CardSideBySide
        skeleton={props.skeleton}
        topSide="back"
        {...coverTarget}
      />
    );
  } else {
    cards = (
      <CardSideBySide
        skeleton={props.skeleton}
        topSide="back"
        {...newDeckCardTarget}
      />
    );
  }

  const children = (
    <View style={containerStyle}>
      <Pressable onPress={onPress} style={styles.cards}>
        {cards}
      </Pressable>
    </View>
  );

  if (!props.deckId) {
    return (
      <CardSizeProvider
        proportions={defaultCardDimensions}
        constraints={styles.cardConstraints}
      >
        {children}
      </CardSizeProvider>
    );
  }

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.cardConstraints}
    >
      {children}
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
});
