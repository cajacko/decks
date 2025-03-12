import React from "react";
import { View, StyleSheet } from "react-native";
import { MenuItem, HoldMenuProps } from "./types";
import useHoldMenu from "./useHoldMenu";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export const HoldMenuWrapper = GestureHandlerRootView;

export default function HoldMenu<I extends MenuItem>(
  props: HoldMenuProps<I>,
): React.ReactNode {
  const state = useHoldMenu<I>(props);

  const rightStyle = useAnimatedStyle(() => ({
    opacity: state.activeDirection.value === "right" ? 1 : 0.5,
  }));
  const leftStyle = useAnimatedStyle(() => ({
    opacity: state.activeDirection.value === "left" ? 1 : 0.5,
  }));
  const topStyle = useAnimatedStyle(() => ({
    opacity: state.activeDirection.value === "top" ? 1 : 0.5,
  }));
  const bottomStyle = useAnimatedStyle(() => ({
    opacity: state.activeDirection.value === "bottom" ? 1 : 0.5,
  }));

  return (
    <GestureDetector gesture={state.pan}>
      <View
        style={styles.container}
        // {...state.panResponder?.panHandlers}
        ref={state.menuRef}
        onPointerEnter={state.onPointerEnter}
        onPointerLeave={state.onPointerLeave}
        onPointerMove={state.onPointerEnter}
      >
        {state.devIndicator && (
          <>
            <Animated.View
              style={[
                styles.devIndicator,
                styles.devIndicatorStart,
                state.devIndicatorStartStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.devIndicator,
                styles.devIndicatorEnd,
                state.devIndicatorEndStyle,
              ]}
            />
          </>
        )}
        {Object.entries(props.menuItems).map(
          ([position, menuItem]) =>
            menuItem && (
              <Animated.View
                key={menuItem.key}
                style={{
                  position: "absolute",
                  top: position === "top" ? -menuItem.height / 2 : undefined,
                  left: position === "left" ? -menuItem.width / 2 : undefined,
                  right: position === "right" ? -menuItem.width / 2 : undefined,
                  bottom:
                    position === "bottom" ? -menuItem.height / 2 : undefined,
                  opacity: state.opacity,
                  alignItems: "center",
                  justifyContent: "center",
                  width:
                    position === "top" || position === "bottom"
                      ? "100%"
                      : undefined,
                  height:
                    position === "left" || position === "right"
                      ? "100%"
                      : undefined,
                }}
              >
                <Animated.View
                  style={[
                    {
                      height: menuItem.height,
                      width: menuItem.width,
                    },
                    position === "top" && topStyle,
                    position === "bottom" && bottomStyle,
                    position === "left" && leftStyle,
                    position === "right" && rightStyle,
                  ]}
                >
                  {props.renderItem({
                    ...menuItem,
                    highlight: false,
                    holdMenuBehaviour: state.holdMenuBehaviour,
                  })}
                </Animated.View>
              </Animated.View>
            ),
        )}
      </View>
    </GestureDetector>
  );
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
  devIndicator: {
    height: 20,
    width: 20,
    top: -10,
    left: -10,
    borderRadius: 10,
    position: "absolute",
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
});
