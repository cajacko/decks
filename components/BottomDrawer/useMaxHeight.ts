import React from "react";
import { LayoutChangeEvent } from "react-native";
import debugLog from "./debugLog";

/**
 * Helper for setting the max available height for the bottom drawer to be. Usually used on the
 * parent container.
 */
export default function useMaxHeight() {
  const [maxHeight, setMaxHeight] = React.useState<number | null>(null);

  return {
    maxHeight,
    onContainerLayout: React.useCallback((event: LayoutChangeEvent) => {
      // Update maxHeight with the max height of the inner scroll content when layout occurs
      const { height } = event.nativeEvent.layout;

      debugLog(
        `set props.maxHeight: ${Math.round(height)} (onContainerLayout)`,
      );

      // We still want people to be able to tap out of the bottom container so lets take off a
      // buffer
      setMaxHeight(height - 100);
    }, []),
  };
}
