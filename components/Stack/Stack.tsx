import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import EmptyStack from "../EmptyStack";
import CardAction from "../CardAction";
import CardSpacer from "../CardSpacer";
import { StackProps } from "./stack.types";
import styles, { getInnerStyle, getShuffleStyle } from "./stack.style";
import useStack from "./useStack";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import StackListItem from "../StackListItem";

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

        <EmptyStack stackId={props.stackId} style={styles.empty} />
      </Animated.View>
    </View>
  );
}
