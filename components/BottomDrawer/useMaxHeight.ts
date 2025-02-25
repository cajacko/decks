import React from "react";
import { LayoutChangeEvent } from "react-native";

/**
 * Helper for setting the max available height for the bottom drawer to be. Usually used on the
 * parent container.
 */
export default function useMaxHeight() {
  const [maxHeight, setMaxHeight] = React.useState<number>();

  return {
    maxHeight,
    onContainerLayout: React.useCallback((event: LayoutChangeEvent) => {
      // Update maxHeight with the max height of the inner scroll content when layout occurs
      const { height } = event.nativeEvent.layout;

      setMaxHeight(height);
    }, []),
  };
}
