import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import CardInstance from "../CardInstance";
import StackTopCard from "../StackTopCard";
import EmptyStack from "../EmptyStack";
import CardAction from "../CardAction";
import CardSpacer from "../CardSpacer";
import { StackProps } from "./stack.types";
import styles, { getInnerStyle, getShuffleStyle } from "./stack.style";
import useStack from "./useStack";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export default function Stack(props: StackProps): React.ReactNode {
  const dimensions = useTabletopContext();
  const {
    cardInstancesIds,
    rotateAnim,
    showActions,
    getCardOffsetPosition,
    handleShuffle,
  } = useStack(props);

  const innerStyle = React.useMemo(
    () => getInnerStyle({ stackPadding: dimensions.stackPadding, rotateAnim }),
    [dimensions.stackPadding, rotateAnim],
  );

  const containerStyle = React.useMemo(
    () => StyleSheet.flatten([styles.container, props.style]),
    [props.style],
  );

  const shuffleStyle = React.useMemo(
    () => getShuffleStyle({ stackPadding: dimensions.stackPadding }),
    [dimensions.stackPadding],
  );

  const cardInstances = React.useMemo(() => {
    if (!cardInstancesIds || cardInstancesIds.length === 0) return undefined;

    return cardInstancesIds.map((cardInstanceId, i) => {
      const isTopCard = i === 0;
      const cardOffsetPosition = getCardOffsetPosition(cardInstanceId);

      const zIndex = cardInstancesIds.length - i + 1;

      // TODO: When we hide the actions, we can render all cardInstances as StackTopCard or
      // rename that component to something like StackCard.
      // It may prevent some remounting and improv some animations? As we're not switching
      // between components
      if (isTopCard) {
        return (
          <StackTopCard
            key={cardInstanceId}
            style={styles.card}
            cardInstanceId={cardInstanceId}
            stackId={props.stackId}
            leftStackId={props.leftStackId}
            rightStackId={props.rightStackId}
            canMoveToBottom={cardInstancesIds.length > 1}
            offsetPosition={cardOffsetPosition}
            zIndex={zIndex}
          />
        );
      }

      return (
        <CardInstance
          key={cardInstanceId}
          cardInstanceId={cardInstanceId}
          style={styles.card}
          offsetPosition={cardOffsetPosition}
          zIndex={zIndex}
        />
      );
    });
  }, [
    props.stackId,
    props.leftStackId,
    props.rightStackId,
    cardInstancesIds,
    getCardOffsetPosition,
  ]);

  return (
    <View style={containerStyle}>
      <Animated.View style={innerStyle}>
        <CardSpacer />

        {cardInstances && (
          <>
            {cardInstances}

            {cardInstances.length > 1 && showActions && (
              <CardAction
                icon="Sh"
                style={shuffleStyle}
                onPress={handleShuffle}
              />
            )}
          </>
        )}

        <EmptyStack style={styles.empty} />
      </Animated.View>
    </View>
  );
}
