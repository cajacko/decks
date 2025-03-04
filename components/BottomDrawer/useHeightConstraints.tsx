import {
  useSharedValue,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { defaultProps, BottomDrawerProps } from "./BottomDrawer.types";
import { dragBuffer, dragHeight, dragOverlap } from "./bottomDrawer.style";
import React from "react";
import { ScrollViewProps } from "react-native";
import debugLog from "./debugLog";

/**
 * Handles the height constraints for the drawer
 */
export default function useHeightConstraints(
  props: Pick<BottomDrawerProps, "maxHeight" | "minHeight" | "height">,
) {
  const { maxHeight: maxHeightProp, minHeight: minHeightProp, height } = props;

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

  // NOTE: If you change this, also change the logic in the effect below it
  const maxHeight = useDerivedValue<number>(() => {
    const maxAvailableSpace =
      customMaxHeight.value -
      sharedStyles.value.dragOverlap -
      sharedStyles.value.dragBuffer;

    const maxHeightForContent =
      drawerContentHeight.value + sharedStyles.value.dragHeight;

    // We still want people to be able to tap out of the bottom container
    const maxHeightBuffer = 100;

    return Math.min(maxAvailableSpace - maxHeightBuffer, maxHeightForContent);
  });

  // NOTE: If you change this, also change the logic in the useDerivedValueAbove
  React.useEffect(() => {
    const newMaxHeight = maxHeightProp ?? defaultProps.maxHeight;

    if (customMaxHeight.value === newMaxHeight) return;

    customMaxHeight.value = newMaxHeight;

    debugLog(
      `useHeightConstraints new customMaxHeight: ${Math.round(newMaxHeight)}, height is: ${Math.round(height.value)}`,
    );

    const maxAvailableSpace =
      newMaxHeight -
      sharedStyles.value.dragOverlap -
      sharedStyles.value.dragBuffer;

    const maxHeightForContent =
      drawerContentHeight.value + sharedStyles.value.dragHeight;

    // We still want people to be able to tap out of the bottom container
    const maxHeightBuffer = 100;

    const maxHeight = Math.min(
      maxAvailableSpace - maxHeightBuffer,
      maxHeightForContent,
    );

    if (height.value < maxHeight) return;

    debugLog(
      `useHeightConstraints height is bigger than max height, shrinking to ${maxHeight}`,
    );

    height.value = withTiming(maxHeight, { duration: 200 });
  }, [
    maxHeightProp,
    customMaxHeight,
    height,
    sharedStyles,
    drawerContentHeight,
  ]);

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
    const newMinHeight = minHeightProp ?? defaultProps.minHeight;

    if (minHeight.value === newMinHeight) return;

    minHeight.value = newMinHeight;

    debugLog(
      `useHeightConstraints new minHeight - ${Math.round(newMinHeight)}`,
    );
  }, [minHeightProp, minHeight]);

  return {
    hasGotMaxHeight,
    onContentLayout,
    maxAutoHeight,
    minHeight,
    maxHeight,
  };
}
