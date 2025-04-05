import React from "react";
import { StyleSheet, View } from "react-native";
import Stack, { StackSkeleton } from "@/components/stacks/Stack";
import Animated, { AnimatedRef } from "react-native-reanimated";
import { StackListProps, StackListRef } from "./StackList.types";
import useStackList, { useInterval } from "./useStackList";
import { minStackCount } from "@/utils/minStacks";
import StackListIndicators from "@/components/stacks/StackListIndicators";

function StackListContent(
  props: Pick<StackListProps, "style" | "handleLayout"> & {
    children: React.ReactNode;
    animatedRef?: AnimatedRef<Animated.ScrollView>;
    indicators?: React.ReactNode;
  },
) {
  const interval = useInterval();

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, props.style]),
    [props.style],
  );

  return (
    <View style={style}>
      <Animated.ScrollView
        ref={props.animatedRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        horizontal
        snapToAlignment="center"
        snapToInterval={interval}
        decelerationRate="fast"
        onLayout={props.handleLayout}
        showsHorizontalScrollIndicator={false}
      >
        {props.children}
      </Animated.ScrollView>
      {props.indicators}
    </View>
  );
}

export function StackListSkeleton(props: Pick<StackListProps, "style">) {
  return (
    <StackListContent style={props.style}>
      <StackSkeleton />
      <StackSkeleton />
    </StackListContent>
  );
}

export default React.forwardRef<StackListRef, StackListProps>(
  function StackList({ handleLayout, style }, ref): React.ReactNode {
    const {
      animatedRef,
      stackIds,
      focussedStackId,
      indicatorIds,
      stackListRef,
    } = useStackList(ref);

    const children = React.useMemo(() => {
      if (!stackIds) return undefined;

      return stackIds?.map((stackId, i) => (
        <Stack
          isFocussed={
            focussedStackId === null ? null : focussedStackId === stackId
          }
          key={stackId}
          stackId={stackId}
          canShowEditDeck={i === 0}
          leftStackId={stackIds[stackIds.indexOf(stackId) - 1]}
          rightStackId={stackIds[stackIds.indexOf(stackId) + 1]}
          stackListRef={stackListRef}
          canDelete={stackIds.length > minStackCount}
        />
      ));
    }, [stackIds, stackListRef, focussedStackId]);

    return (
      <StackListContent
        animatedRef={animatedRef}
        style={style}
        handleLayout={handleLayout}
        indicators={
          indicatorIds &&
          indicatorIds.length > 1 && (
            <StackListIndicators
              style={styles.indicators}
              stackIds={indicatorIds}
              focussedStackId={focussedStackId}
            />
          )
        }
      >
        {children}
      </StackListContent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicators: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    zIndex: 2,
  },
  scrollView: {
    flexDirection: "row",
    position: "relative",
    zIndex: 1,
  },
  contentContainer: {
    alignItems: "center",
    minWidth: "100%",
    justifyContent: "center",
  },
});
