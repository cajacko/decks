import React from "react";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { StyleProp, ViewStyle } from "react-native";
import { MenuItemProps } from "./types";
import { GestureDetector } from "react-native-gesture-handler";

export default function MenuItem({
  component,
  height,
  position,
  width,
  style,
  contentStyle: contentStyleProp,
  isHighlighted,
  tapGesture,
}: MenuItemProps): React.ReactNode {
  const children = React.useMemo(
    () =>
      typeof component === "function"
        ? component({ isHighlighted })
        : component,
    [component, isHighlighted],
  );

  const containerStyle = React.useMemo(
    (): StyleProp<AnimatedStyle<ViewStyle>> => [
      {
        zIndex: 2,
        position: "absolute",
        top: position === "top" ? -height / 2 : undefined,
        left: position === "left" ? -width / 2 : undefined,
        right: position === "right" ? -width / 2 : undefined,
        bottom: position === "bottom" ? -height / 2 : undefined,
        alignItems: "center",
        justifyContent: "center",
        width: position === "top" || position === "bottom" ? "100%" : undefined,
        height:
          position === "left" || position === "right" ? "100%" : undefined,
      },
      style,
    ],
    [style, position, height, width],
  );

  const contentStyle = React.useMemo(
    (): StyleProp<AnimatedStyle<ViewStyle>> => [
      {
        height,
        width,
      },
      contentStyleProp,
    ],
    [contentStyleProp, height, width],
  );

  return (
    <Animated.View style={containerStyle}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={contentStyle}>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
