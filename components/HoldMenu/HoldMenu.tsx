import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { MenuItem, HoldMenuProps } from "./types";
import useHoldMenu, { DEV_INDICATOR } from "./useHoldMenu";

export default function HoldMenu<I extends MenuItem>(
  props: HoldMenuProps<I>
): React.ReactNode {
  const state = useHoldMenu<I>(props);

  return (
    <View
      style={styles.container}
      {...state.panResponder?.panHandlers}
      onTouchStart={state.onTouchStart}
      ref={state.menuRef}
      onPointerEnter={state.onPointerEnter}
      onPointerLeave={state.onPointerLeave}
    >
      {DEV_INDICATOR && (
        <Animated.View
          style={StyleSheet.flatten([
            styles.devIndicator,
            state.devIndicatorStyle,
          ])}
        />
      )}
      {state.renderMenu &&
        props.menuItems.map((menuItem) => (
          <Animated.View
            key={menuItem.key}
            style={{
              position: "absolute",
              top: menuItem.top,
              left: menuItem.left,
              height: menuItem.height,
              width: menuItem.width,
              opacity: state.opacity,
            }}
          >
            {DEV_INDICATOR && (
              <View
                style={StyleSheet.flatten([
                  styles.bufferBox,
                  {
                    backgroundColor:
                      menuItem.key === state.highlightedItem?.key
                        ? "yellow"
                        : "green",
                    top: -(menuItem.touchBuffer ?? state.touchBuffer),
                    left: -(menuItem.touchBuffer ?? state.touchBuffer),
                    right: -(menuItem.touchBuffer ?? state.touchBuffer),
                    bottom: -(menuItem.touchBuffer ?? state.touchBuffer),
                  },
                ])}
              />
            )}
            {props.renderItem({
              ...menuItem,
              highlight: menuItem.key === state.highlightedItem?.key,
              holdMenuBehaviour: state.holdMenuBehaviour,
            })}
          </Animated.View>
        ))}
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
