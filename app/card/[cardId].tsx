import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CardFront from "@/components/CardFront";
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

function Drawer({
  height,
  children,
}: {
  children?: React.ReactNode;
  height: SharedValue<number>;
  heightStyle?: ReturnType<typeof useAnimatedStyle>;
}) {
  const pressed = useSharedValue<boolean>(false);
  const draggedDistance = useSharedValue(0);

  const minHeight = 100;
  const maxHeight = 500;

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
      height.value = withSpring(
        Math.min(
          Math.max(height.value - event.translationY, minHeight),
          maxHeight,
        ),
        {
          damping: 20,
          stiffness: 300,
        },
      );

      draggedDistance.value = height.value;
    })
    .onFinalize(() => {
      pressed.value = false;

      if (draggedDistance.value > 10) return;

      // This is a press

      const distanceToTop = height.value - minHeight;
      const distanceToBottom = maxHeight - height.value;

      height.value = withSpring(
        distanceToTop < distanceToBottom ? maxHeight : minHeight,
        {
          damping: 20,
          stiffness: 100,
        },
      );
    });

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
}

export default function Modal() {
  const { cardId } = useLocalSearchParams();

  const height = useSharedValue(100);

  const bufferStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled
        horizontal={false}
      >
        {typeof cardId === "string" && <CardFront cardId={cardId} />}
        <Animated.View style={[styles.drawerBuffer, bufferStyle]} />
      </ScrollView>
      <Drawer height={height}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 40 }}>Form Content</Text>
          {typeof cardId === "string" && <CardFront cardId={cardId} />}
        </View>
      </Drawer>
    </GestureHandlerRootView>
  );
}

const borderRadius = 20;
const dragOverlap = 20;
const dragBuffer = 10;
const dragHeaderHeight = Math.max(30, borderRadius);
const dragHeight = dragHeaderHeight + dragOverlap + dragBuffer;
// const drawerOffset = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  scrollContainer: {},
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 10,
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
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
  drawerBuffer: {
    opacity: 0,
    width: "100%",
  },
  content: {
    backgroundColor: "white",
    flex: 1,
    marginTop: dragHeight - dragOverlap - dragBuffer,
  },
});
