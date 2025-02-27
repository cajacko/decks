import React from "react";
import { Tabletops } from "@/store/types";
import { StyleSheet } from "react-native";
import { CardProps } from "@/components/Card";
import CardInstance from "@/components/CardInstance";
import StackTopCard from "@/components/StackTopCard";

export interface StackListItemProps {
  cardInstanceId: Tabletops.CardInstanceId;
  zIndex: number;
  isTopCard: boolean;
  cardOffsetPosition?: number;
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom: boolean;
}

export default function StackListItem(
  props: StackListItemProps,
): React.ReactNode {
  const { cardInstanceId, zIndex, isTopCard, cardOffsetPosition } = props;

  const cardProps = React.useMemo(
    (): CardProps => ({
      offsetPosition: cardOffsetPosition,
      zIndex,
    }),
    [cardOffsetPosition, zIndex],
  );

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.card, { zIndex }]),
    [zIndex],
  );

  // TODO: When we hide the actions, we can render all cardInstances as StackTopCard or
  // rename that component to something like StackCard.
  // It may prevent some remounting and improv some animations? As we're not switching
  // between components
  if (isTopCard) {
    return (
      <StackTopCard
        style={style}
        key={cardInstanceId}
        cardInstanceId={cardInstanceId}
        stackId={props.stackId}
        leftStackId={props.leftStackId}
        rightStackId={props.rightStackId}
        canMoveToBottom={props.canMoveToBottom}
        CardProps={cardProps}
      />
    );
  }

  return (
    <CardInstance
      style={style}
      key={cardInstanceId}
      cardInstanceId={cardInstanceId}
      CardProps={cardProps}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
