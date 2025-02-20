import React from "react";
import { View, StyleSheet } from "react-native";
import CardInstance from "../CardInstance";
import StackTopCard from "../StackTopCard";
import EmptyStack from "../EmptyStack";
import CardAction from "../CardAction";
import CardSpacer from "../CardSpacer";
import { StackProps } from "./stack.types";
import styles, { getStackDimensions } from "./stack.style";
import useStack from "./useStack";

export default function Stack(props: StackProps): React.ReactNode {
  const dimensions = getStackDimensions(props);
  const { cardInstances, ...state } = useStack(props, dimensions);

  return (
    <View style={StyleSheet.flatten([styles.container, props.style])}>
      <View style={{ margin: dimensions.stackPadding }}>
        {cardInstances && cardInstances.length > 0 ? (
          <>
            <CardSpacer
              width={dimensions.cardWidth}
              height={dimensions.cardHeight}
            />

            {cardInstances.map((cardInstance, i) => {
              const isTopCard = i === 0;
              const positionStyle = state.getCardPositionStyle({
                cardInstanceId: cardInstance.cardInstanceId,
                isTopCard,
              });

              const style = StyleSheet.flatten([
                styles.card,
                positionStyle,
                // Decrements zIndex for each card, so the top card has the highest zIndex,
                // finishing at 1
                { zIndex: cardInstances.length - i },
              ]);

              // TODO: When we hide the actions, we can render all cardInstances as StackTopCard or
              // rename that component to something like StackCard.
              // It may prevent some remounting and improv some animations? As we're not switching
              // between components
              if (isTopCard) {
                return (
                  <StackTopCard
                    key={cardInstance.cardInstanceId}
                    cardId={cardInstance.cardId}
                    state={cardInstance.state}
                    style={style}
                    width={dimensions.cardWidth}
                    height={dimensions.cardHeight}
                    cardInstanceId={cardInstance.cardInstanceId}
                    stackId={props.stackId}
                    leftStackId={props.leftStackId}
                    rightStackId={props.rightStackId}
                    canMoveToBottom={cardInstances.length > 1}
                  />
                );
              }

              return (
                <CardInstance
                  key={cardInstance.cardInstanceId}
                  cardId={cardInstance.cardId}
                  state={cardInstance.state}
                  width={dimensions.cardWidth}
                  height={dimensions.cardHeight}
                  style={style}
                />
              );
            })}

            {cardInstances && cardInstances.length > 1 && (
              <CardAction
                icon="Sh"
                style={StyleSheet.flatten([
                  styles.shuffleButton,
                  {
                    zIndex: 0,
                    bottom: -dimensions.stackPadding,
                    left: -dimensions.stackPadding,
                  },
                ])}
                onPress={state.handleShuffle}
              />
            )}
          </>
        ) : (
          <EmptyStack
            cardWidth={dimensions.cardWidth}
            cardHeight={dimensions.cardHeight}
          />
        )}
      </View>
    </View>
  );
}
