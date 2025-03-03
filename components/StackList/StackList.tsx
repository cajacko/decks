import React from "react";
import { StyleSheet } from "react-native";
import Stack from "@/components/Stack";
import Animated from "react-native-reanimated";
import { StackListProps } from "./StackList.types";
import useStackList from "./useStackList";
import { minStackCount } from "@/utils/minStacks";

export default function StackList({
  handleLayout,
  style,
  skeleton,
}: StackListProps): React.ReactNode {
  const { animatedRef, interval, stackIds, stackListRef } = useStackList();

  const children = React.useMemo(() => {
    if (!stackIds) return undefined;

    let stacks = stackIds;

    if (skeleton) {
      stacks = stackIds.slice(0, minStackCount);
    }

    return stacks?.map((stackId) => (
      <Stack
        key={stackId}
        stackId={stackId}
        leftStackId={stackIds[stackIds.indexOf(stackId) - 1]}
        rightStackId={stackIds[stackIds.indexOf(stackId) + 1]}
        stackListRef={stackListRef}
        canDelete={stackIds.length > minStackCount}
        skeleton={skeleton}
      />
    ));
  }, [stackIds, stackListRef, skeleton]);

  const scrollViewStyle = React.useMemo(
    () => StyleSheet.flatten([styles.scrollView, style]),
    [style],
  );

  return (
    <Animated.ScrollView
      ref={animatedRef}
      style={scrollViewStyle}
      contentContainerStyle={styles.contentContainer}
      horizontal
      snapToAlignment="center"
      snapToInterval={interval}
      decelerationRate="fast"
      onLayout={handleLayout}
    >
      {children}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
  },
  contentContainer: {
    alignItems: "center",
  },
});
