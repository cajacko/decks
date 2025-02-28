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
import { useEditCardModal } from "@/components/EditCardModal";
import IconButton from "@/components/IconButton";
import { DeckTabletopProvider } from "@/context/Deck";

export default function Tabletop({
  tabletopId,
  style,
  deckId,
}: TabletopProps): React.ReactNode {
  useTabletopToolbar({ tabletopId });
  const { component, open } = useEditCardModal({
    type: "new-card-in-deck",
    id: deckId,
  });

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
    <>
      <DeckTabletopProvider
        availableHeight={size.height}
        availableWidth={size.width}
        tabletopId={tabletopId}
        deckId={deckId}
      >
        <Animated.View style={style}>
          <StackList style={animatedStyle} handleLayout={handleLayout} />

          {component}
          <IconButton icon="+" onPress={open} style={styles.action} />
        </Animated.View>
      </DeckTabletopProvider>
    </>
  );
}

const styles = StyleSheet.create({
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
