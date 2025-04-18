import React from "react";
import { StyleSheet } from "react-native";
import { HoldMenuProps } from "./types";
import useHoldMenu from "./useHoldMenu";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import MenuItem from "./MenuItem";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";

export const HoldMenuWrapper = GestureHandlerRootView;

export default function HoldMenu(props: HoldMenuProps): React.ReactNode {
  const state = useHoldMenu(props);

  const menuItemStyle = useAnimatedStyle(() => ({
    opacity:
      state.menuOpacityOverride.value === null
        ? state.menuOpacity.value
        : state.menuOpacityOverride.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: state.scale.value }],
  }));

  const hasChildren = !!props.children;

  const containerStyle = React.useMemo(
    () => [
      hasChildren ? styles.containerWithChildren : styles.container,
      props.style,
    ],
    [hasChildren, props.style],
  );

  const childrenStyle = React.useMemo(
    () => [styles.children, scaleStyle],
    [scaleStyle],
  );

  const devIndicatorStartStyle = useAnimatedStyle(() => ({
    opacity: state.devIndicatorOpacity.value,
    transform: [
      { translateX: state.devStartIndicator.value.x },
      { translateY: state.devStartIndicator.value.y },
    ],
  }));

  const devIndicatorEndStyle = useAnimatedStyle(() => ({
    opacity: state.devIndicatorOpacity.value,
    transform: [
      { translateX: state.devEndIndicator.value.x },
      { translateY: state.devEndIndicator.value.y },
    ],
  }));

  const longPressStyle = useAnimatedStyle(() => ({
    opacity: state.longPressTransition.value / 10,
    transform: [{ scale: state.longPressTransition.value }],
  }));

  const childrenProp = props.children;

  const children = React.useMemo((): React.ReactNode | undefined => {
    if (typeof childrenProp === "function") {
      return childrenProp({
        longPressSharedValue: state.longPressTransition,
        longPressStyle,
      });
    }

    return childrenProp;
  }, [childrenProp, longPressStyle, state.longPressTransition]);

  usePerformanceMonitor({
    Component: HoldMenu.name,
  });

  const component = (
    <Animated.View style={containerStyle}>
      {children && (
        <Animated.View style={childrenStyle}>{children}</Animated.View>
      )}
      {props.menuItems && (
        <>
          {props.menuItems.top && (
            <MenuItem
              {...props.menuItems.top}
              tapGesture={state.menuTaps.top}
              position="top"
              style={menuItemStyle}
              isHighlighted={state.highlightedPosition === "top"}
            />
          )}
          {props.menuItems.bottom && (
            <MenuItem
              {...props.menuItems.bottom}
              tapGesture={state.menuTaps.bottom}
              position="bottom"
              style={menuItemStyle}
              isHighlighted={state.highlightedPosition === "bottom"}
            />
          )}
          {props.menuItems.left && (
            <MenuItem
              {...props.menuItems.left}
              tapGesture={state.menuTaps.left}
              position="left"
              style={menuItemStyle}
              isHighlighted={state.highlightedPosition === "left"}
            />
          )}
          {props.menuItems.right && (
            <MenuItem
              {...props.menuItems.right}
              tapGesture={state.menuTaps.right}
              position="right"
              style={menuItemStyle}
              isHighlighted={state.highlightedPosition === "right"}
            />
          )}

          {state.devIndicator && (
            <>
              <Animated.View
                style={[
                  styles.devIndicator,
                  styles.devIndicatorStart,
                  devIndicatorStartStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.devIndicator,
                  styles.devIndicatorEnd,
                  devIndicatorEndStyle,
                ]}
              />
            </>
          )}
        </>
      )}
    </Animated.View>
  );

  if (!state.gesture) return component;

  return <GestureDetector gesture={state.gesture}>{component}</GestureDetector>;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: "pointer",
  },
  containerWithChildren: {
    position: "relative",
    cursor: "pointer",
  },
  children: {
    zIndex: 1,
    position: "relative",
  },
  devIndicator: {
    height: 20,
    width: 20,
    top: -10,
    left: -10,
    borderRadius: 10,
    position: "absolute",
    zIndex: 3,
  },
  devIndicatorStart: {
    backgroundColor: "green",
  },
  devIndicatorEnd: {
    backgroundColor: "red",
  },
  bufferBox: {
    position: "absolute",
  },
  hideMenu: {
    opacity: 0,
  },
});
