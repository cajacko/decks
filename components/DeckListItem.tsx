import React from "react";
import { StyleSheet, View, Pressable, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckCards, selectDeckLastScreen } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "@/components/cards/connected/CardSideBySide";
import { newDeckCardTarget } from "@/constants/newDeckData";
import uuid from "@/utils/uuid";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import { CardTargetProvider } from "@/components/cards/context/CardTarget";

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

  const target = React.useMemo((): Target => {
    if (!props.deckId) {
      return newDeckCardTarget;
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

  return (
    <CardTargetProvider target={target}>
      <View style={containerStyle}>
        <Pressable style={styles.cards} onPress={onPress}>
          <CardSideBySide topSide="back" target={target} />
        </Pressable>
      </View>
    </CardTargetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 300,
  },
  cards: {
    position: "relative",
    flex: 1,
  },
});
