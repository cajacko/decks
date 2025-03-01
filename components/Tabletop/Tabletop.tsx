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
  deckId,
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

  const hasLayout = React.useRef(false);

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      // PRevents us updating when the keyboard comes into view, which we don't want. Maybe there's
      // a better solution for this, that then allows window changes as well?
      if (hasLayout.current) return;

      hasLayout.current = true;

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
        <TabletopToolbar deckId={deckId} />
        <StackList style={animatedStyle} handleLayout={handleLayout} />
      </Animated.View>
    </TabletopProvider>
  );
}
