import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckCards, selectDeckLastScreen } from "@/store/selectors/decks";
import { useRouter } from "expo-router";
import { Target } from "@/utils/cardTarget";
import CardSideBySide from "@/components/cards/connected/CardSideBySide";
import CardSideBySideSkeleton from "@/components/cards/connected/CardSideBySideSkeleton";
import { newDeckCardTarget } from "@/constants/newDeckData";
import uuid from "@/utils/uuid";
import { createDeckHelper } from "@/store/actionHelpers/decks";
import { CardTargetProvider } from "@/components/cards/context/CardTarget";
import useVibrate from "@/hooks/useVibrate";
import { TouchableScale } from "@/components/ui/Pressables";

export interface DeckListItemProps {
  deckId: string | null;
  style?: ViewStyle;
}

function DeckListItemContent({
  style,
  children,
  onPress,
}: Pick<DeckListItemProps, "style"> & {
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  const containerStyle = React.useMemo(
    () => [styles.container, style],
    [style],
  );

  return (
    <View style={containerStyle}>
      {onPress ? (
        <TouchableScale style={styles.cards} onPress={onPress}>
          {children}
        </TouchableScale>
      ) : (
        <View style={styles.cards}>{children}</View>
      )}
    </View>
  );
}

export function DeckListItemSkeleton({ style }: Partial<DeckListItemProps>) {
  return (
    <DeckListItemContent style={style}>
      <CardSideBySideSkeleton />
    </DeckListItemContent>
  );
}

export default function DeckListItem(
  props: DeckListItemProps,
): React.ReactNode {
  const { vibrate } = useVibrate();
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
    vibrate?.("DeckListItem");

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
  }, [props.deckId, navigate, lastScreen, dispatch, vibrate]);

  return (
    <CardTargetProvider target={target}>
      <DeckListItemContent style={props.style} onPress={onPress}>
        <CardSideBySide topSide="back" target={target} />
      </DeckListItemContent>
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
