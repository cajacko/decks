import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { MenuItem, HoldMenuProps } from "./types";
import useHoldMenu from "./useHoldMenu";

export default function HoldMenu<I extends MenuItem>(
  props: HoldMenuProps<I>,
): React.ReactNode {
  const state = useHoldMenu<I>(props);

  return (
    <View
      style={styles.container}
      {...state.panResponder?.panHandlers}
      ref={state.menuRef}
      onPointerEnter={state.onPointerEnter}
      onPointerLeave={state.onPointerLeave}
      onPointerMove={state.onPointerEnter}
    >
      {state.devIndicator && (
        <Animated.View style={[styles.devIndicator, state.devIndicatorStyle]} />
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
              <View
                style={{
                  height: menuItem.height,
                  width: menuItem.width,
                }}
              >
                {props.renderItem({
                  ...menuItem,
                  highlight: menuItem.key === state.highlightedItem?.key,
                  holdMenuBehaviour: state.holdMenuBehaviour,
                })}
              </View>
            </Animated.View>
          ),
      )}
    </View>
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
    backgroundColor: "red",
    position: "absolute",
  },
  bufferBox: {
    position: "absolute",
  },
});
