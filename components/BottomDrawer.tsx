import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ScrollViewProps,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SharedValue,
  withClamp,
  useDerivedValue,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import React from "react";

export const BottomDrawerWrapper = GestureHandlerRootView;

export interface BottomDrawerProps {
  children?: React.ReactNode;
  height: SharedValue<number>;
  maxHeight?: number;
  minHeight?: number;
}

export interface BottomDrawerRef {
  open: () => void;
  close: () => void;
}

const defaultProps = {
  maxHeight: 1000,
  minHeight: 100,
};

export function useMaxHeight() {
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

export function useHeight(startingHeight?: number) {
  const sharedValue = useSharedValue(startingHeight ?? defaultProps.minHeight);

  return {
    sharedValue,
    heightStyle: useAnimatedStyle(() => {
      return {
        height: sharedValue.value,
      };
    }),
  };
}

const autoAnimateConfig = {
  damping: 20,
  stiffness: 100,
};

export default React.forwardRef<BottomDrawerRef, BottomDrawerProps>(
  function BottonDrawer(
    { height, children, maxHeight: maxHeightProp, minHeight: minHeightProp },
    ref,
  ) {
    const minHeight = useSharedValue(minHeightProp ?? defaultProps.minHeight);
    const customMaxHeight = useSharedValue(
      maxHeightProp ?? defaultProps.maxHeight,
    );
    const drawerContentHeight = useSharedValue(0);
    const pressed = useSharedValue<boolean>(false);
    const draggedDistance = useSharedValue(0);

    const maxHeight = useDerivedValue<number>(() => {
      const maxAvailableSpace =
        customMaxHeight.value - dragOverlap - dragBuffer;

      const maxHeightForContent = drawerContentHeight.value + dragHeight;

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
        backgroundColor: pressed.value ? "#c5c5c5" : "#e5e5e5",
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

    return (
      <View style={styles.drawer}>
        <Animated.View style={[styles.drawerContainer, heightStyle]}>
          <View style={styles.drawerContainer}>
            <GestureDetector gesture={pan}>
              <View style={styles.dragBar}>
                <Animated.View style={[styles.dragBox, dragBarColor]}>
                  <Text style={styles.dragIcon}>====</Text>
                </Animated.View>
                <Animated.View style={[styles.dragHeader, dragBarColor]} />
              </View>
            </GestureDetector>
            <ScrollView style={styles.content}>
              <View onLayout={onContentLayout}>{children}</View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  },
);

const borderRadius = 20;
const dragOverlap = 20;
const dragBuffer = 10;
const dragHeaderHeight = Math.max(30, borderRadius);
const dragHeight = dragHeaderHeight + dragOverlap + dragBuffer;

const styles = StyleSheet.create({
  dragBar: {
    position: "absolute",
    top: -(dragOverlap + dragBuffer),
    width: "100%",
    height: dragHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: dragBuffer,
  },
  dragBox: {
    alignItems: "center",
    justifyContent: "center",
    height: dragOverlap * 2,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 2,
    position: "relative",
  },
  dragHeader: {
    marginTop: -dragOverlap,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    height: dragHeaderHeight,
    width: "100%",
    zIndex: 1,
    position: "relative",
  },
  dragIcon: {
    fontSize: 20,
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContainer: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    flex: 1,
    width: "100%",
  },
  content: {
    backgroundColor: "white",
    flex: 1,
    marginTop: dragHeight - dragOverlap - dragBuffer,
  },
});
