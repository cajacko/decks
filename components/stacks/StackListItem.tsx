import React from "react";
import { Tabletops } from "@/store/types";
import { StyleSheet } from "react-native";
import CardInstance, {
  CardInstanceSkeleton,
} from "@/components/cards/connected/CardInstance";
import StackTopCard from "@/components/stacks/StackTopCard";
import useFlag from "@/hooks/useFlag";
import { StackListRef } from "@/components/stacks/StackList";

export interface StackListItemProps {
  cardInstanceId: Tabletops.CardInstanceId;
  zIndex: number;
  isTopCard: boolean;
  cardOffsetPosition?: number;
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom: boolean;
  stackListRef: React.RefObject<StackListRef>;
}

function useStyle(zIndex: number) {
  return React.useMemo(
    () => StyleSheet.flatten([styles.card, { zIndex }]),
    [zIndex],
  );
}

export function StackListItemSkeleton({
  zIndex,
}: Pick<StackListItemProps, "zIndex">) {
  const style = useStyle(zIndex);

  return <CardInstanceSkeleton style={style} />;
}

export default function StackListItem(
  props: StackListItemProps,
): React.ReactNode {
  const { cardInstanceId, zIndex, isTopCard, cardOffsetPosition } = props;
  const allTouchable = useFlag("STACK_LIST_ITEM_BEHAVIOUR") === "all-touchable";

  const style = useStyle(zIndex);

  // TODO: When we hide the actions, we can render all cardInstances as StackTopCard or
  // rename that component to something like StackCard.
  // It may prevent some remounting and improv some animations? As we're not switching
  // between components
  if (isTopCard || allTouchable) {
    return (
      <StackTopCard
        style={style}
        key={cardInstanceId}
        cardInstanceId={cardInstanceId}
        stackId={props.stackId}
        leftStackId={props.leftStackId}
        rightStackId={props.rightStackId}
        canMoveToBottom={props.canMoveToBottom}
        offsetPosition={cardOffsetPosition}
        hideActions={!isTopCard}
        stackListRef={props.stackListRef}
      />
    );
  }

  return (
    <CardInstance
      style={style}
      key={cardInstanceId}
      cardInstanceId={cardInstanceId}
      offsetPosition={cardOffsetPosition}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
