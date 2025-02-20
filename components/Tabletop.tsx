import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
  Dimensions,
} from "react-native";
import Stack, { getStackDimensions } from "./Stack";
import { useAppSelector } from "@/store/hooks";
import { selectStackIds } from "@/store/slices/tabletop";
import { useIsHoldMenuActive } from "@/components/HoldMenu/HoldMenu.context";

export interface TabletopProps {
  tabletopId: string;
  style?: StyleProp<ViewStyle>;
}

export default function Tabletop({
  tabletopId,
  style,
}: TabletopProps): React.ReactNode {
  const isHoldMenuActive = useIsHoldMenuActive();

  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId })
  );

  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen")
  );

  const { spaceBetweenStacks, stackWidth } = getStackDimensions({
    availableHeight: size.height,
    availableWidth: size.width,
  });

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      const { width, height } = event.nativeEvent.layout;

      setSize({ width, height });
    },
    []
  );

  if (!stackIds) {
    throw new Error(`Tabletop with id ${tabletopId} not found`);
  }

  return (
    <ScrollView
      onLayout={handleLayout}
      style={StyleSheet.flatten([styles.scrollView, style])}
      contentContainerStyle={styles.container}
      horizontal
      snapToAlignment="center"
      // FIXME: Shouldn't need to add this buffer the calcs should work
      snapToInterval={stackWidth + 10}
      decelerationRate="fast"
      scrollEnabled={!isHoldMenuActive}
    >
      {stackIds.map((stackId) => (
        <Stack
          key={stackId}
          stackId={stackId}
          style={{ paddingHorizontal: spaceBetweenStacks / 2 }}
          leftStackId={stackIds[stackIds.indexOf(stackId) - 1]}
          rightStackId={stackIds[stackIds.indexOf(stackId) + 1]}
          availableHeight={size.height}
          availableWidth={size.width}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "row",
  },
  container: {
    alignItems: "center",
  },
});
