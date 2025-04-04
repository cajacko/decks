import React from "react";
import { StyleSheet, View, Pressable, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeck, selectDeckCards } from "@/store/selectors/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "@/components/cards/connected/CardSideBySide";
import CardSideBySideSkeleton from "@/components/cards/connected/CardSideBySideSkeleton";
import Skeleton from "@/components/ui/Skeleton";
import ThemedText from "@/components/ui/ThemedText";
import IconButton, { IconButtonSkeleton } from "@/components/forms/IconButton";
import { copyDeckHelper } from "@/store/actionHelpers/decks";
import uuid from "@/utils/uuid";
import { CardTargetProvider } from "@/components/cards/context/CardTarget";
import ContentWidth from "@/components/ui/ContentWidth";
import useVibrate from "@/hooks/useVibrate";

export interface ExpandedDeckListItemProps {
  deckId: string;
  style?: ViewStyle;
}

const iconSize = 40;

function ExpandedDeckListItemContent({
  children,
  style,
  onPress,
  actions,
  text,
}: Pick<ExpandedDeckListItemProps, "style"> & {
  children: React.ReactNode;
  actions: React.ReactNode;
  onPress?: () => void;
  text?: React.ReactNode;
}) {
  const containerStyle = React.useMemo(
    () => [styles.container, style],
    [style],
  );

  return (
    <ContentWidth padding="standard" contentContainerStyle={containerStyle}>
      {onPress ? (
        <Pressable onPress={onPress} style={styles.cards}>
          {children}
        </Pressable>
      ) : (
        <View style={styles.cards}>{children}</View>
      )}

      <View style={styles.details}>
        <View style={styles.text}>{text}</View>
        <View style={styles.actions}>{actions}</View>
      </View>
    </ContentWidth>
  );
}

export function ExpandedDeckListItemSkeleton({
  style,
}: Partial<ExpandedDeckListItemProps>) {
  return (
    <ExpandedDeckListItemContent
      style={style}
      text={
        <>
          <Skeleton variant="text" width="50%" style={{ marginBottom: 20 }} />
          <Skeleton variant="text" width="100%" textSpacingBottom />
          <Skeleton variant="text" width="100%" textSpacingBottom />
          <Skeleton variant="text" width="20%" />
        </>
      }
      actions={
        <>
          <IconButtonSkeleton size={iconSize} />
          <IconButtonSkeleton size={iconSize} />
          <IconButtonSkeleton size={iconSize} />
        </>
      }
    >
      <CardSideBySideSkeleton />
    </ExpandedDeckListItemContent>
  );
}

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
      <ExpandedDeckListItemContent
        style={props.style}
        onPress={onPressCards}
        text={
          <>
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
          </>
        }
        actions={
          <>
            <IconButton
              icon="remove-red-eye"
              onPress={view}
              size={iconSize}
              variant="transparent"
              vibrate
            />
            <IconButton
              icon="play-arrow"
              onPress={play}
              size={iconSize}
              variant="transparent"
              vibrate
            />
            <IconButton
              icon="content-copy"
              size={iconSize}
              onPress={copyDeck}
              variant="transparent"
              vibrate
            />
          </>
        }
      >
        <CardSideBySide topSide="front" target={coverTarget} />
      </ExpandedDeckListItemContent>
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
