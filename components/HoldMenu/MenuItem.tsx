import React from "react";
import Animated from "react-native-reanimated";
import { MenuItemProps } from "./types";

export default function MenuItem({
  component,
  height,
  position,
  width,
  style,
  contentStyle,
  isHighlighted,
}: MenuItemProps): React.ReactNode {
  const children = React.useMemo(
    () =>
      typeof component === "function"
        ? component({ isHighlighted })
        : component,
    [component, isHighlighted],
  );

  return (
    <Animated.View
      style={[
        {
          zIndex: 2,
          position: "absolute",
          top: position === "top" ? -height / 2 : undefined,
          left: position === "left" ? -width / 2 : undefined,
          right: position === "right" ? -width / 2 : undefined,
          bottom: position === "bottom" ? -height / 2 : undefined,
          alignItems: "center",
          justifyContent: "center",
          width:
            position === "top" || position === "bottom" ? "100%" : undefined,
          height:
            position === "left" || position === "right" ? "100%" : undefined,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height,
            width,
          },
          contentStyle,
          // position === "top" && topStyle,
          // position === "bottom" && bottomStyle,
          // position === "left" && leftStyle,
          // position === "right" && rightStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
