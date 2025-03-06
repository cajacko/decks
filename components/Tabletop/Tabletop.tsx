import React from "react";
import { Dimensions, ScrollViewProps, StyleSheet } from "react-native";
import { useTabletopToolbar } from "@/components/TabletopToolbar";
import { TabletopProps } from "@/components/Tabletop/Tabletop.types";
import StackList from "@/components/StackList";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { DeckTabletopProvider } from "@/context/Deck";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";
import useEnsureTabletop from "@/hooks/useEnsureTabletop";

export default function Tabletop({
  tabletopId,
  deckId,
}: TabletopProps): React.ReactNode {
  const { hasTabletop } = useEnsureTabletop({ tabletopId });
  useTabletopToolbar({ tabletopId });

  useDeckLastScreen({
    deckId,
    screen: "play",
  });

  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen"),
  );

  // Prevents janky layout reorganising when we get the initial layout
  const opacity = useSharedValue(0);
  const hasLayout = React.useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const skeleton = useScreenSkeleton(Tabletop.name) || !hasTabletop;

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      // Prevents us updating when the keyboard comes into view, which we don't want. Maybe there's
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
    <DeckTabletopProvider
      availableHeight={size.height}
      availableWidth={size.width}
      tabletopId={tabletopId}
      deckId={deckId}
    >
      <Animated.View style={styles.content} onLayout={handleLayout}>
        {!skeleton && <StackList style={animatedStyle} skeleton={skeleton} />}
      </Animated.View>
    </DeckTabletopProvider>
  );
}

const styles = StyleSheet.create({
  content: {
    position: "relative",
    flex: 1,
    zIndex: 2,
  },
  background: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
