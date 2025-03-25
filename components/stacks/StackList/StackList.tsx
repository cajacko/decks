import React from "react";
import { StyleSheet, View } from "react-native";
import Stack from "@/components/stacks/Stack";
import Animated from "react-native-reanimated";
import { StackListProps } from "./StackList.types";
import useStackList from "./useStackList";
import { minStackCount } from "@/utils/minStacks";
import StackListIndicators from "@/components/stacks/StackListIndicators";

export default function StackList({
  handleLayout,
  style: styleProp,
  skeleton,
}: StackListProps): React.ReactNode {
  const {
    animatedRef,
    interval,
    stackIds,
    stackListRef,
    focussedStackId,
    indicatorIds,
  } = useStackList();

  const children = React.useMemo(() => {
    if (!stackIds) return undefined;

    let stacks = stackIds;

    if (skeleton) {
      stacks = stackIds.slice(0, minStackCount);
    }

    return stacks?.map((stackId, i) => (
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
        skeleton={skeleton}
      />
    ));
  }, [stackIds, stackListRef, skeleton, focussedStackId]);

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  return (
    <View style={style}>
      <Animated.ScrollView
        ref={animatedRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        horizontal
        snapToAlignment="center"
        snapToInterval={interval}
        decelerationRate="fast"
        onLayout={handleLayout}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </Animated.ScrollView>
      {indicatorIds && indicatorIds.length > 1 && (
        <StackListIndicators
          style={styles.indicators}
          stackIds={indicatorIds}
          focussedStackId={focussedStackId}
        />
      )}
    </View>
  );
}

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
