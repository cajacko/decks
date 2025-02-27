import { useSharedValue, useDerivedValue } from "react-native-reanimated";
import { defaultProps, BottomDrawerProps } from "./BottomDrawer.types";
import { dragBuffer, dragHeight, dragOverlap } from "./bottomDrawer.style";
import React from "react";
import { ScrollViewProps } from "react-native";
import debugLog from "./debugLog";

// TODO: When we update the constraints, then check if the drawer height needs to change

/**
 * Handles the height constraints for the drawer
 */
export default function useHeightConstraints(
  props: Pick<BottomDrawerProps, "maxHeight" | "minHeight">,
) {
  const { maxHeight: maxHeightProp, minHeight: minHeightProp } = props;

  /**
   * If the max height prop is null, it means we're pending setting the max height (normally waiting
   * for an onLayoutChange event in the parent)
   */
  const hasGotMaxHeight = maxHeightProp !== null;

  const sharedStyles = useSharedValue({
    dragBuffer,
    dragHeight,
    dragOverlap,
  });

  const minHeight = useSharedValue(minHeightProp ?? defaultProps.minHeight);

  const customMaxHeight = useSharedValue(
    maxHeightProp ?? defaultProps.maxHeight,
  );

  const drawerContentHeight = useSharedValue(0);

  const maxHeight = useDerivedValue<number>(() => {
    const maxAvailableSpace =
      customMaxHeight.value -
      sharedStyles.value.dragOverlap -
      sharedStyles.value.dragBuffer;

    const maxHeightForContent =
      drawerContentHeight.value + sharedStyles.value.dragHeight;

    return Math.min(maxAvailableSpace, maxHeightForContent);
  });

  const maxAutoHeight = useDerivedValue<number>(() => {
    return Math.min(maxHeight.value, customMaxHeight.value / 2);
  });

  // Gets the drawer content size, as we don't need to show a bottom drawer higher than this
  const onContentLayout = React.useCallback<
    Required<ScrollViewProps>["onLayout"]
  >(
    (event) => {
      debugLog(
        `onContentLayout (Drawer Scroll Content) - ${Math.round(event.nativeEvent.layout.height)}`,
      );

      drawerContentHeight.value = event.nativeEvent.layout.height;
    },
    [drawerContentHeight],
  );

  // Update the min/ max values when the prop changes from the parent

  React.useEffect(() => {
    const newMaxHeight = maxHeightProp ?? defaultProps.maxHeight;

    if (customMaxHeight.value !== newMaxHeight) {
      customMaxHeight.value = newMaxHeight;
    }
  }, [maxHeightProp, customMaxHeight]);

  React.useEffect(() => {
    const newMinHeight = minHeightProp ?? defaultProps.minHeight;

    if (minHeight.value !== newMinHeight) {
      minHeight.value = newMinHeight;
    }
  }, [minHeightProp, minHeight]);

  return {
    hasGotMaxHeight,
    onContentLayout,
    maxAutoHeight,
    minHeight,
    maxHeight,
  };
}
