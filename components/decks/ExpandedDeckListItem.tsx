import React from "react";
import { StyleSheet, View, Pressable, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeck, selectDeckCards } from "@/store/slices/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "@/components/cards/connected/CardSideBySide";
import ThemedText from "@/components/ui/ThemedText";
import IconButton from "@/components/forms/IconButton";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import { CardTargetProvider } from "@/components/cards/context/CardTarget";
import ContentWidth from "@/components/ui/ContentWidth";
import useVibrate from "@/hooks/useVibrate";

export interface ExpandedDeckListItemProps {
  deckId: string;
  style?: ViewStyle;
  skeleton?: boolean;
}

const iconSize = 40;

export default function ExpandedDeckListItem(
  props: ExpandedDeckListItemProps,
): React.ReactNode {
  const { vibrate } = useVibrate();
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const firstDeckCardId = useAppSelector(
    (state) => selectDeckCards(state, { deckId: props.deckId })?.[0]?.cardId,
  );
  const { name, description } =
    useAppSelector((state) => selectDeck(state, props)) ?? {};

  const coverTarget = React.useMemo((): Target => {
    return firstDeckCardId
      ? { id: firstDeckCardId, type: "card" }
      : { id: props.deckId, type: "deck-defaults" };
  }, [firstDeckCardId, props.deckId]);

  const play = React.useCallback(() => {
    navigate(`/deck/${props.deckId}/play`);
  }, [props.deckId, navigate]);

  const view = React.useCallback(() => {
    navigate(`/deck/${props.deckId}`);
  }, [props.deckId, navigate]);

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  const copyDeck = React.useCallback(() => {
    const newDeckId = uuid();

    dispatch(copyDeckHelper({ deckId: props.deckId, newDeckId }));

    navigate(`/deck/${newDeckId}`);
  }, [dispatch, props.deckId, navigate]);

  const onPressCards = React.useCallback(() => {
    vibrate?.("ExpandedDeckListItem");
    play();
  }, [play, vibrate]);

  return (
    <CardTargetProvider target={coverTarget}>
      <ContentWidth padding="standard" contentContainerStyle={containerStyle}>
        <Pressable onPress={onPressCards} style={styles.cards}>
          <CardSideBySide topSide="front" target={coverTarget} />
        </Pressable>
        <View style={styles.details}>
          <View style={styles.text}>
            {name && (
              <ThemedText type="h3" style={styles.title}>
                {name}
              </ThemedText>
            )}
            {description && (
              <ThemedText type="body1" numberOfLines={4}>
                {description}
              </ThemedText>
            )}
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="remove-red-eye"
              onPress={view}
              size={iconSize}
              variant="transparent"
            />
            <IconButton
              icon="play-arrow"
              onPress={play}
              size={iconSize}
              variant="transparent"
            />
            <IconButton
              icon="content-copy"
              size={iconSize}
              onPress={copyDeck}
              variant="transparent"
            />
          </View>
        </View>
      </ContentWidth>
    </CardTargetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  title: {
    marginBottom: 10,
  },
  text: {
    flex: 1,
  },
  details: {
    flex: 1,
    height: "100%",
    marginLeft: 20,
    paddingVertical: 40,
  },
  cards: {
    position: "relative",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
