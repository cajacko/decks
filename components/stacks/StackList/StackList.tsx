import React from "react";
import { StyleSheet, View } from "react-native";
import Stack, { StackSkeleton } from "@/components/stacks/Stack";
import Animated, { AnimatedRef } from "react-native-reanimated";
import { StackListProps, StackListRef } from "./StackList.types";
import useStackList, { useInterval } from "./useStackList";
import { minStackCount } from "@/utils/minStacks";
import StackListIndicators from "@/components/stacks/StackListIndicators";
import { useStackContext } from "@/components/stacks/Stack/Stack.context";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";

function StackListContent(
  props: Pick<StackListProps, "style"> & {
    children: React.ReactNode;
    animatedRef?: AnimatedRef<Animated.ScrollView>;
    indicators?: React.ReactNode;
  },
) {
  const interval = useInterval();
  const dimensions = useStackContext();

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, props.style]),
    [props.style],
  );

  const positionStyles = React.useMemo(
    () => ({
      above: StyleSheet.flatten([
        styles.position,
        {
          top: 0,
          height: dimensions.aboveStackHeight,
        },
      ]),
      below: StyleSheet.flatten([
        styles.position,
        {
          bottom: 0,
          height: dimensions.belowStackHeight,
        },
      ]),
    }),
    [dimensions.belowStackHeight, dimensions.aboveStackHeight],
  );

  usePerformanceMonitor({
    Component: StackListContent.name,
  });

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
        showsHorizontalScrollIndicator={false}
      >
        {props.children}
      </Animated.ScrollView>
      {props.indicators && (
        <View style={positionStyles.below}>{props.indicators}</View>
      )}
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
  function StackList({ style }, ref): React.ReactNode {
    usePerformanceMonitor({
      Component: StackList.name,
    });

    const {
      animatedRef,
      stackIds,
      focussedStackId,
      indicatorIds,
      stackListRef,
    } = useStackList(ref);

    const dimensions = useStackContext();

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

    const indicatorsStyle = React.useMemo(
      () =>
        StyleSheet.flatten([
          styles.indicatorsContainer,
          { height: dimensions.belowStackHeight },
        ]),
      [dimensions.belowStackHeight],
    );

    return (
      <StackListContent
        animatedRef={animatedRef}
        style={style}
        indicators={
          indicatorIds &&
          indicatorIds.length > 1 && (
            <StackListIndicators
              style={indicatorsStyle}
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
  position: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
  indicatorsContainer: {
    zIndex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    flexDirection: "row",
    position: "relative",
    zIndex: 2,
  },
  contentContainer: {
    alignItems: "center",
    minWidth: "100%",
    justifyContent: "center",
  },
});
