import { StyleSheet, View, Text, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  SharedValue,
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
  maxHeight: SharedValue<number>;
  minHeight: SharedValue<number>;
}

export interface BottomDrawerRef {
  open: () => void;
  close: () => void;
}

const autoAnimateConfig = {
  damping: 20,
  stiffness: 100,
};

export default React.forwardRef<BottomDrawerRef, BottomDrawerProps>(
  function BottonDrawer({ height, children, maxHeight, minHeight }, ref) {
    const pressed = useSharedValue<boolean>(false);
    const draggedDistance = useSharedValue(0);

    const heightStyle = useAnimatedStyle(() => {
      return {
        height: height.value,
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

        if (newHeight < minHeight.value) {
          newHeight = minHeight.value;
        }

        if (newHeight > maxHeight.value) {
          newHeight = maxHeight.value;
        }

        draggedDistance.value = event.translationY;

        height.value = withSpring(newHeight, {
          damping: 20,
          stiffness: 300,
        });
      })
      .onFinalize(() => {
        pressed.value = false;

        if (Math.abs(draggedDistance.value) > 10) return;

        // This is a press

        const distanceToTop = height.value - minHeight.value;
        const distanceToBottom = maxHeight.value - height.value;

        height.value = withSpring(
          distanceToTop < distanceToBottom ? maxHeight.value : minHeight.value,
          autoAnimateConfig,
        );
      });

    React.useImperativeHandle(ref, () => ({
      open: () => {
        height.value = withSpring(maxHeight.value, autoAnimateConfig);
      },
      close: () => {
        height.value = withSpring(minHeight.value, autoAnimateConfig);
      },
    }));

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
            <ScrollView style={styles.content}>{children}</ScrollView>
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
