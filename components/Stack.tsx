import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectVisibleCardInstances,
  shuffleStack,
} from "@/store/slices/stacks";
import CardInstance from "./CardInstance";
import StackTopCard from "./StackTopCard";
import EmptyStack from "./EmptyStack";
import CardAction from "./CardAction";

export interface StackProps {
  stackId: string;
  cardWidth?: number;
  style?: StyleProp<ViewStyle>;
  leftStackId?: string;
  rightStackId?: string;
}

export default function Stack({
  stackId,
  style,
  cardWidth,
  leftStackId,
  rightStackId,
}: StackProps): React.ReactNode {
  const dispatch = useAppDispatch();

  const cardInstances = useAppSelector((state) =>
    selectVisibleCardInstances(state, { stackId })
  );

  const handleShuffle = React.useCallback(() => {
    dispatch(shuffleStack({ stackId, allCardInstancesState: "noChange" }));
  }, [dispatch, stackId]);

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <View style={styles.inner}>
        {cardInstances?.map(({ cardId, cardInstanceId, state }, i) => {
          if (i === 0) {
            return (
              <StackTopCard
                key={cardInstanceId}
                cardId={cardId}
                state={state}
                style={styles.topCard}
                width={cardWidth}
                cardInstanceId={cardInstanceId}
                stackId={stackId}
                leftStackId={leftStackId}
                rightStackId={rightStackId}
                canMoveToBottom={cardInstances.length > 1}
              />
            );
          }

          return (
            <CardInstance
              key={cardInstanceId}
              cardId={cardId}
              state={state}
              width={cardWidth}
              // TODO: would be good to maintain the rotation angles when moving cards around
              // Prob store this in local component state?
              // Also handle any number of rendered items, not just 3
              style={
                i === 0
                  ? styles.topCard
                  : i === 1
                  ? styles.secondCard
                  : styles.thirdCard
              }
            />
          );
        }) ?? <EmptyStack cardWidth={cardWidth} />}
        {cardInstances && (
          <CardAction
            icon="Sh"
            style={styles.shuffleButton}
            onPress={handleShuffle}
          />
        )}
      </View>
    </View>
  );
}

const marginLeft = 50;
const marginBottom = marginLeft;
const marginTop = marginBottom;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  inner: {
    marginTop,
    marginHorizontal: 20,
    marginLeft,
    marginBottom,
  },
  shuffleButton: {
    position: "absolute",
    bottom: -marginBottom,
    left: -marginLeft,
    zIndex: 3,
  },
  topCard: {
    position: "relative",
    zIndex: 4,
  },
  // TODO: Darken cards behind the front? Potential render a black translucent card over the top of
  // each?
  secondCard: {
    position: "absolute",
    top: -2,
    left: 2,
    transform: [{ rotate: "3deg" }],
    zIndex: 2,
  },
  thirdCard: {
    position: "absolute",
    top: 2,
    left: -2,
    transform: [{ rotate: "-3deg" }],
    zIndex: 1,
  },
});
