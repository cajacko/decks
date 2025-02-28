import React from "react";
import { Dimensions, ScrollViewProps } from "react-native";
import TabletopToolbar from "@/components/TabletopToolbar";
import { TabletopProps } from "@/components/Tabletop/Tabletop.types";
import { TabletopProvider } from "./Tabletop.context";
import StackList from "@/components/StackList";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function Tabletop({
  tabletopId,
  style,
}: TabletopProps): React.ReactNode {
  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen"),
  );

  // Prevents janky layout reorganising when we get the initial layout
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      const { width, height } = event.nativeEvent.layout;

      opacity.value = withTiming(1, {
        duration: 200,
      });
      setSize({ width, height });
    },
    [opacity],
  );

  return (
    <TabletopProvider
      height={size.height}
      width={size.width}
      tabletopId={tabletopId}
    >
      <Animated.View style={style}>
        <TabletopToolbar />
        <StackList style={animatedStyle} handleLayout={handleLayout} />
      </Animated.View>
    </TabletopProvider>
  );
}
