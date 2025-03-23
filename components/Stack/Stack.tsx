import React from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import EmptyStack from "@/components/EmptyStack";
import CardAction from "@/components/CardAction";
import CardSpacer from "@/components/cards/connected/CardSpacer";
import { StackProps } from "./stack.types";
import styles, { getShuffleStyle } from "./stack.style";
import useStack from "./useStack";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";
import StackListItem from "@/components/StackListItem";
import { Target } from "@/utils/cardTarget";

export default function Stack(props: StackProps): React.ReactNode {
  const dimensions = useTabletopContext();

  const target = React.useMemo(
    (): Target => ({ id: dimensions.deckId, type: "deck-defaults" }),
    [dimensions.deckId],
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const widthStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  const innerStyle = React.useMemo(
    () => [styles.inner, animatedStyle],
    [animatedStyle],
  );

  const containerStyle = React.useMemo(
    () => [widthStyle, styles.container, props.style],
    [props.style, widthStyle],
  );

  const shuffleStyle = React.useMemo(
    () =>
      getShuffleStyle({
        buttonSize: dimensions.buttonSize,
      }),
    [dimensions.buttonSize],
  );

  const cardInstances = React.useMemo(() => {
    if (props.skeleton) return null;
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
      />
    ));
  }, [
    props.stackId,
    props.leftStackId,
    props.rightStackId,
    cardInstancesIds,
    getCardOffsetPosition,
    props.skeleton,
  ]);

  return (
    <Animated.View style={containerStyle}>
      <View style={styles.shuffleContainer} />
      <Animated.View style={innerStyle}>
        {cardInstances && (
          <View style={styles.cardInstances}>
            <CardSpacer target={target} />
            {cardInstances}
          </View>
        )}

        <EmptyStack
          style={styles.empty}
          buttonTitle={props.skeleton ? undefined : emptyStackButton?.title}
          buttonAction={props.skeleton ? undefined : emptyStackButton?.action}
        />
      </Animated.View>

      <View style={shuffleStyle}>
        {cardInstances && cardInstances.length > 1 && !shakeToShuffleActive && (
          <CardAction
            icon="shuffle"
            style={styles.shuffleButton}
            onPress={handleShuffle}
            vibrate
          />
        )}
      </View>
    </Animated.View>
  );
}
