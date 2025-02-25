import React from "react";
import { ScrollViewProps } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withClamp,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import {
  BottomDrawerProps,
  BottomDrawerRef,
  defaultProps,
} from "./BottomDrawer.types";
import {
  dragBuffer,
  dragHeight,
  dragOverlap,
  dragBarBackgroundColorDefault,
  dragBarBackgroundColorPressed,
} from "./bottomDrawer.style";

const autoAnimateConfig = {
  damping: 20,
  stiffness: 100,
};

export default function useBottomDrawer(
  props: Omit<BottomDrawerProps, "children">,
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height, maxHeight: maxHeightProp, minHeight: minHeightProp } = props;

  const minHeight = useSharedValue(minHeightProp ?? defaultProps.minHeight);
  const customMaxHeight = useSharedValue(
    maxHeightProp ?? defaultProps.maxHeight,
  );
  const drawerContentHeight = useSharedValue(0);
  const pressed = useSharedValue<boolean>(false);
  const draggedDistance = useSharedValue(0);
  const sharedStyles = useSharedValue({
    dragBarBackgroundColorPressed,
    dragBarBackgroundColorDefault,
    dragBuffer,
    dragHeight,
    dragOverlap,
  });

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

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
      // Needed for web
      maxHeight: height.value,
    };
  });

  const dragBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value
        ? sharedStyles.value.dragBarBackgroundColorPressed
        : sharedStyles.value.dragBarBackgroundColorDefault,
    };
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      draggedDistance.value = 0;
    })
    .onChange((event) => {
      let newHeight = height.value - event.changeY * 10;

      draggedDistance.value = event.translationY;

      height.value = withClamp(
        {
          max: maxHeight.value,
          min: minHeight.value,
        },
        withSpring(newHeight, {
          damping: 20,
          stiffness: 300,
        }),
      );
    })
    .onFinalize(() => {
      pressed.value = false;

      if (Math.abs(draggedDistance.value) > 10) return;

      // This is a press

      let moveTo: "top" | "bottom";

      const distanceToTop = height.value - minHeight.value;
      const distanceToBottom = maxAutoHeight.value - height.value;

      if (height.value >= maxAutoHeight.value) {
        moveTo = "bottom";
      } else if (distanceToTop < distanceToBottom) {
        moveTo = "top";
      } else {
        moveTo = "bottom";
      }

      height.value = withSpring(
        moveTo === "top" ? maxAutoHeight.value : minHeight.value,
        autoAnimateConfig,
      );
    });

  React.useImperativeHandle(ref, () => ({
    open: () => {
      height.value = withSpring(maxAutoHeight.value, autoAnimateConfig);
    },
    close: () => {
      height.value = withSpring(minHeight.value, autoAnimateConfig);
    },
  }));

  const onContentLayout = React.useCallback<
    Required<ScrollViewProps>["onLayout"]
  >(
    (event) => {
      drawerContentHeight.value = event.nativeEvent.layout.height;
    },
    [drawerContentHeight],
  );

  return {
    heightStyle,
    pan,
    dragBarColor,
    onContentLayout,
  };
}
