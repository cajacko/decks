import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  StyleProps,
} from "react-native-reanimated";
import EmptyStack from "@/components/stacks/EmptyStack";
import CardAction from "@/components/forms/CardAction";
import CardSpacer from "@/components/cards/connected/CardSpacer";
import CardSpacerSkeleton from "@/components/cards/connected/CardSpacerSkeleton";
import { StackProps } from "./stack.types";
import styles, { getShuffleStyle } from "./stack.style";
import useStack, { useStackWidth } from "./useStack";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import StackListItem, {
  StackListItemSkeleton,
} from "@/components/stacks/StackListItem";
import { Target } from "@/utils/cardTarget";

function StackContent(
  props: Pick<StackProps, "style"> & {
    emptyStack?: React.ReactNode;
    button?: React.ReactNode;
    cards?: React.ReactNode;
    cardSpacer: React.ReactNode;
    containerStyle?: StyleProps;
    innerStyle?: StyleProps;
  },
) {
  const dimensions = useTabletopContext();

  const innerStyle = React.useMemo(
    () => [styles.inner, props.innerStyle],
    [props.innerStyle],
  );

  const containerStyle = React.useMemo(
    () => [props.containerStyle, styles.container, props.style],
    [props.style, props.containerStyle],
  );

  const shuffleStyle = React.useMemo(
    () =>
      getShuffleStyle({
        buttonSize: dimensions.buttonSize,
      }),
    [dimensions.buttonSize],
  );

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.shuffleContainer} />
      <Animated.View style={innerStyle}>
        {props.cards && (
          <View style={styles.cardInstances}>
            {props.cardSpacer}
            {props.cards}
          </View>
        )}

        {props.emptyStack}
      </Animated.View>

      <View style={shuffleStyle}>{props.button}</View>
    </Animated.View>
  );
}

export function StackSkeleton(
  props: Pick<StackProps, "style">,
): React.ReactNode {
  const cards = React.useMemo(
    () => [<StackListItemSkeleton key="stack-1" zIndex={1} />],
    [],
  );
  const width = useStackWidth();

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <StackContent
      cardSpacer={<CardSpacerSkeleton />}
      cards={cards}
      style={props.style}
      containerStyle={containerStyle}
    />
  );
}

export default function Stack(props: StackProps): React.ReactNode {
  const { deckId } = useTabletopContext();

  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  const {
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    width,
    opacity,
    emptyStackButton,
    shakeToShuffleActive,
  } = useStack(props);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  function getShouldShowShuffle(): boolean {
    if (!cardInstances) return false;
    if (cardInstances.length <= 1) return false;
    if (shakeToShuffleActive) return false;
    if (props.isFocussed === false) return false;

    return true;
  }

  const cardInstances = React.useMemo(() => {
    if (!cardInstancesIds || cardInstancesIds.length === 0) return null;

    return cardInstancesIds.map((cardInstanceId, i) => (
      <StackListItem
        key={cardInstanceId}
        cardInstanceId={cardInstanceId}
        isTopCard={i === 0}
        cardOffsetPosition={getCardOffsetPosition(cardInstanceId)}
        zIndex={cardInstancesIds.length - i + 1}
        canMoveToBottom={cardInstancesIds.length > 1}
        stackId={props.stackId}
        leftStackId={props.leftStackId}
        rightStackId={props.rightStackId}
        stackListRef={props.stackListRef}
      />
    ));
  }, [
    props.stackId,
    props.leftStackId,
    props.rightStackId,
    cardInstancesIds,
    getCardOffsetPosition,
    props.stackListRef,
  ]);

  return (
    <StackContent
      style={props.style}
      emptyStack={
        <EmptyStack
          style={styles.empty}
          buttonTitle={emptyStackButton?.title}
          buttonAction={emptyStackButton?.action}
        />
      }
      cardSpacer={<CardSpacer target={target} />}
      cards={cardInstances}
      containerStyle={containerStyle}
      innerStyle={innerStyle}
      button={
        getShouldShowShuffle() && (
          <CardAction
            icon="shuffle"
            style={styles.shuffleButton}
            onPress={handleShuffle}
            // Vibrate covered by handleShuffle as it gets called programmatically on shake
            vibrate={false}
          />
        )
      }
    />
  );
}
