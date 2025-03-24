import React from "react";
import { LayoutChangeEvent } from "react-native";
import debugLog from "./debugLog";

/**
 * Helper for setting the max available height for the bottom drawer to be. Usually used on the
 * parent container.
 */
export default function useMaxHeight() {
  const [containerSize, setContainerSize] = React.useState<{
    height: number;
    width: number;
  } | null>(null);

  return {
    containerHeight: containerSize?.height,
    containerWidth: containerSize?.width,
    // We still want people to be able to tap out of the bottom container so lets take off a
    // buffer
    maxHeight: containerSize?.height ? containerSize.height - 100 : null,
    onContainerLayout: React.useCallback((event: LayoutChangeEvent) => {
      // Update maxHeight with the max height of the inner scroll content when layout occurs
      const { height, width } = event.nativeEvent.layout;

      debugLog(
        `set props.maxHeight: ${Math.round(height)} (onContainerLayout)`,
      );

      setContainerSize({ height, width });
    }, []),
  };
}
