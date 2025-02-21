import React from "react";
import { ScrollView, StyleSheet, ScrollViewProps } from "react-native";
import Stack from "@/components/Stack";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import { selectStackIds } from "@/store/slices/tabletop";
import { useAppSelector } from "@/store/hooks";

export interface StackListProps {
  handleLayout: Required<ScrollViewProps>["onLayout"];
}

export default function StackList({
  handleLayout,
}: StackListProps): React.ReactNode {
  const { stackWidth, spaceBetweenStacks, tabletopId } = useTabletopContext();
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId }),
  );

  const children = React.useMemo(
    () =>
      stackIds?.map((stackId) => (
        <Stack
          key={stackId}
          stackId={stackId}
          style={{ paddingHorizontal: spaceBetweenStacks / 2 }}
          leftStackId={stackIds[stackIds.indexOf(stackId) - 1]}
          rightStackId={stackIds[stackIds.indexOf(stackId) + 1]}
        />
      )),
    [spaceBetweenStacks, stackIds],
  );

  return (
    <ScrollView
      style={StyleSheet.flatten([styles.scrollView])}
      contentContainerStyle={styles.contentContainer}
      horizontal
      snapToAlignment="center"
      // FIXME: Shouldn't need to add this buffer the calcs should work
      snapToInterval={stackWidth + 10}
      decelerationRate="fast"
      onLayout={handleLayout}
    >
      {children}
    </ScrollView>
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
