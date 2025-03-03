import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import EmptyStack from "@/components/EmptyStack";
import CardAction from "@/components/CardAction";
import CardSpacer from "@/components/CardSpacer";
import { StackProps } from "./stack.types";
import styles, { getShuffleStyle } from "./stack.style";
import useStack from "./useStack";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";
import StackListItem from "@/components/StackListItem";

export default function Stack(props: StackProps): React.ReactNode {
  const dimensions = useTabletopContext();

  const {
    cardInstancesIds,
    showActions,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    width,
    handleDeleteStack,
    opacity,
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
    () => StyleSheet.flatten([widthStyle, styles.container, props.style]),
    [props.style, widthStyle],
  );

  const shuffleStyle = React.useMemo(
    () => getShuffleStyle({ stackPadding: dimensions.stackPadding }),
    [dimensions.stackPadding],
  );

  const cardInstances = React.useMemo(() => {
    if (!cardInstancesIds || cardInstancesIds.length === 0) return undefined;

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
  ]);

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={innerStyle}>
        {cardInstances && (
          <View style={styles.cardInstances}>
            <CardSpacer />
            {cardInstances}

            {cardInstances.length > 1 && showActions && (
              <CardAction
                icon="shuffle"
                style={shuffleStyle}
                onPress={handleShuffle}
              />
            )}
          </View>
        )}

        <EmptyStack
          style={styles.empty}
          handleDeleteStack={handleDeleteStack}
        />
      </Animated.View>
    </Animated.View>
  );
}
