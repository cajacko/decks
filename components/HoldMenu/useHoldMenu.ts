import React from "react";
import {
  View,
  PanResponder,
  Animated,
  PanResponderGestureState,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectUserSettings } from "@/store/slices/userSettings";
import { MenuItem, HoldMenuProps } from "./types";

export const DEV_INDICATOR = false;

export default function useHoldMenu<I extends MenuItem>({
  touchBuffer = 20,
  ...props
}: HoldMenuProps<I>) {
  let { holdMenuBehaviour } = useAppSelector(selectUserSettings);
  const menuRef = React.useRef<View>(null);
  const opacity = React.useRef(new Animated.Value(1)).current;
  const hoverIndicatorOpacity = React.useRef(new Animated.Value(0)).current;
  const hoverIndicatorX = React.useRef(new Animated.Value(0)).current;
  const hoverIndicatorY = React.useRef(new Animated.Value(0)).current;
  const [renderMenu, setRenderMenu] = React.useState(false);
  const [highlightedItemState, setHighlightedItem] = React.useState<I | null>(
    null
  );
  const [menuPosition, setMenuPosition] = React.useState<{
    pageX: number;
    pageY: number;
  } | null>(null);

  // Pan gesture can't use the state, it needs to be in a ref, and our flags need it in the state
  const menuPositionRef = React.useRef<{
    pageX: number;
    pageY: number;
  } | null>(null);

  menuPositionRef.current = menuPosition;

  let highlightedItem = highlightedItemState;

  if (!menuPosition) {
    holdMenuBehaviour = "tap";
    highlightedItem = null;
  }

  const updateMenuPosition = React.useCallback(() => {
    menuRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ pageX, pageY });
    });
  }, []);

  React.useLayoutEffect(updateMenuPosition, [updateMenuPosition]);

  const getHoveredItem = (gestureState: PanResponderGestureState) => {
    if (!menuPositionRef.current) return;

    const touchX = gestureState.moveX - menuPositionRef.current.pageX;
    const touchY = gestureState.moveY - menuPositionRef.current.pageY;

    if (DEV_INDICATOR) {
      // Move the hover indicator to the touch position
      Animated.spring(hoverIndicatorX, {
        toValue: touchX,
        useNativeDriver: true,
      }).start();

      Animated.spring(hoverIndicatorY, {
        toValue: touchY,
        useNativeDriver: true,
      }).start();
    }

    // Find which menu item contains the touch point
    const hoveredItem = props.menuItems.find((item) => {
      const finalTouchBuffer = item.touchBuffer ?? touchBuffer;

      return (
        touchX >= item.left - finalTouchBuffer &&
        touchX <= item.left + item.width + finalTouchBuffer &&
        touchY >= item.top - finalTouchBuffer &&
        touchY <= item.top + item.height + finalTouchBuffer
      );
    });

    return hoveredItem ?? null;
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        // This accounts for scroll views and stuff.
        updateMenuPosition();
        setHighlightedItem(null);
        opacity.setValue(0);
        setRenderMenu(true);

        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();

        if (DEV_INDICATOR) {
          // Show hover indicator
          Animated.timing(hoverIndicatorOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        }
      },

      onPanResponderMove: (_, gestureState) => {
        const hoveredItem = getHoveredItem(gestureState);

        if (hoveredItem && hoveredItem.key !== highlightedItem?.key) {
          setHighlightedItem(hoveredItem);
        } else if (!hoveredItem) {
          setHighlightedItem(null);
        }
      },

      onPanResponderRelease: (event, gestureState) => {
        const hoveredItem = getHoveredItem(gestureState);

        if (hoveredItem) {
          props.handleAction(hoveredItem);
        }

        setHighlightedItem(null);

        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setRenderMenu(false);
        });

        if (DEV_INDICATOR) {
          // Hide hover indicator
          Animated.timing(hoverIndicatorOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const onTouchStart = React.useCallback(() => {
    setHighlightedItem(null);

    if (renderMenu) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setRenderMenu(false);
      });
    } else {
      opacity.setValue(0);
      setRenderMenu(true);

      Animated.timing(opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [opacity, renderMenu]);

  return {
    panResponder: holdMenuBehaviour === "hold" ? panResponder : undefined,
    menuRef,
    renderMenu,
    opacity,
    highlightedItem,
    holdMenuBehaviour,
    onTouchStart: holdMenuBehaviour === "tap" ? onTouchStart : undefined,
    touchBuffer,
    devIndicatorStyle: {
      opacity: hoverIndicatorOpacity,
      transform: [
        { translateX: hoverIndicatorX },
        { translateY: hoverIndicatorY },
      ],
    },
  };
}
