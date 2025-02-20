import React from "react";
import { View, StyleSheet } from "react-native";
import CardInstance from "../CardInstance";
import StackTopCard from "../StackTopCard";
import EmptyStack from "../EmptyStack";
import CardAction from "../CardAction";
import CardSpacer from "../CardSpacer";
import { StackProps } from "./stack.types";
import styles from "./stack.style";
import useStack from "./useStack";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

// TODO: all the same component in map? Maybe the animation should be higher up, not in the
// component? As it's layout from here, not from the component itself

export default function Stack(props: StackProps): React.ReactNode {
  const dimensions = useTabletopContext();
  const { cardInstancesIds, ...state } = useStack(props, dimensions);

  return (
    <View style={StyleSheet.flatten([styles.container, props.style])}>
      <View style={{ margin: dimensions.stackPadding }}>
        <CardSpacer />

        {cardInstancesIds && cardInstancesIds.length > 0 && (
          <>
            {cardInstancesIds.map((cardInstanceId, i) => {
              const isTopCard = i === 0;
              const positionStyle = state.getCardPositionStyle({
                cardInstanceId,
                isTopCard,
              });

              const style = StyleSheet.flatten([
                styles.card,
                positionStyle,
                // Decrements zIndex for each card, so the top card has the highest zIndex,
                // finishing at 1
                { zIndex: cardInstancesIds.length - i + 1 },
              ]);

              // TODO: When we hide the actions, we can render all cardInstances as StackTopCard or
              // rename that component to something like StackCard.
              // It may prevent some remounting and improv some animations? As we're not switching
              // between components
              if (isTopCard) {
                return (
                  <StackTopCard
                    key={cardInstanceId}
                    style={style}
                    cardInstanceId={cardInstanceId}
                    stackId={props.stackId}
                    leftStackId={props.leftStackId}
                    rightStackId={props.rightStackId}
                    canMoveToBottom={cardInstancesIds.length > 1}
                  />
                );
              }

              return (
                <CardInstance
                  key={cardInstanceId}
                  cardInstanceId={cardInstanceId}
                  style={style}
                />
              );
            })}

            {cardInstancesIds && cardInstancesIds.length > 1 && (
              <CardAction
                icon="Sh"
                style={StyleSheet.flatten([
                  styles.shuffleButton,
                  {
                    zIndex: 1,
                    bottom: -dimensions.stackPadding,
                    left: -dimensions.stackPadding,
                  },
                ])}
                onPress={state.handleShuffle}
              />
            )}
          </>
        )}

        <EmptyStack style={StyleSheet.flatten([styles.card, { zIndex: 0 }])} />
      </View>
    </View>
  );
}
