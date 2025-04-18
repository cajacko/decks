import React from "react";
import { Tabletops } from "@/store/types";
import { StyleSheet } from "react-native";
import CardInstance, {
  CardInstanceSkeleton,
} from "@/components/cards/connected/CardInstance";
import StackTopCard from "@/components/stacks/StackTopCard";
import useFlag from "@/hooks/useFlag";
import { StackListRef } from "@/components/stacks/StackList";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";

export interface StackListItemProps {
  cardInstanceId: Tabletops.CardInstanceId;
  zIndex: number;
  isTopCard: boolean;
  cardOffsetPosition?: number;
  stackId: string;
  leftStackId?: string;
  rightStackId?: string;
  stackListRef: React.RefObject<StackListRef>;
  shuffleProgress: SharedValue<number>;
  index: number;
  length: number;
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
  usePerformanceMonitor({
    Component: StackListItem.name,
  });

  const { cardInstanceId, zIndex, isTopCard, cardOffsetPosition } = props;
  const allTouchable = useFlag("STACK_LIST_ITEM_BEHAVIOUR") === "all-touchable";

  const style = useStyle(zIndex);

  // Only 1 item is hidden at any given props.shuffleProgress.value. And this changes linerarly
  // through the progress from 0-1
  const animatedStyle = useAnimatedStyle(() => {
    const hiddenIndex = Math.floor(props.shuffleProgress.value * props.length);
    let isHidden = props.index === hiddenIndex;

    if (props.shuffleProgress.value === 0) {
      isHidden = false;
    }

    return {
      transform: [
        {
          translateY: isHidden ? -9999 : 0,
        },
      ],
    };
  }, [props.index, props.length]);

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
        offsetPosition={cardOffsetPosition}
        hideActions={!isTopCard}
        stackListRef={props.stackListRef}
        animatedStyle={animatedStyle}
      />
    );
  }

  return (
    <CardInstance
      style={style}
      key={cardInstanceId}
      cardInstanceId={cardInstanceId}
      offsetPosition={cardOffsetPosition}
      animatedStyle={animatedStyle}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
  },
});
