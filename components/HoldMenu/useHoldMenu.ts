import React from "react";
import {
  View,
  PanResponder,
  Animated,
  PanResponderGestureState,
} from "react-native";
import { MenuItem, HoldMenuProps, MenuPosition, MenuItems } from "./types";
import useFlag from "@/hooks/useFlag";
import usePointer from "@/hooks/usePointer";

const maxDistanceForTap = 10;
const minDistanceForDirection = maxDistanceForTap;
const maxTimeoutForTap = 500;
const fadeInDuration = 100;
const fadeOutDuration = 200;

function getGestureDistance(gestureState: PanResponderGestureState) {
  return Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
}
function withGetTargetDirection<P extends object = object>(
  menuItems: MenuItems<P>,
) {
  return (gestureState: PanResponderGestureState): MenuItem<P> | null => {
    const distance = getGestureDistance(gestureState);

    if (distance < minDistanceForDirection) return null;

    const { dx, dy } = gestureState;

    // Calculate the angle of movement
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Determine the ideal direction based on the angle
    let preferredDirection: MenuPosition;

    if (angle >= -45 && angle < 45) {
      preferredDirection = "right";
    } else if (angle >= 45 && angle < 135) {
      preferredDirection = "bottom";
    } else if (angle >= -135 && angle < -45) {
      preferredDirection = "top";
    } else {
      preferredDirection = "left";
    }

    // If the preferred direction is available, return it
    if (menuItems[preferredDirection]) {
      return menuItems[preferredDirection] ?? null;
    }

    return null;
  };
}

// NOTE: 50ms is the max we ever want to wait before showing the menu
const swipeHoldThresholds: {
  distance:
    | {
        greaterThan: number;
        lessThan?: number;
      }
    | {
        greaterThan?: number;
        lessThan: number;
      };
  timeout:
    | {
        greaterThan: number;
        lessThan?: number;
      }
    | {
        greaterThan?: number;
        lessThan: number;
      };
  showMenu: boolean;
}[] = [
  {
    distance: {
      lessThan: 1,
    },
    timeout: {
      greaterThan: 20,
    },
    showMenu: true,
  },
  {
    distance: {
      lessThan: 10,
    },
    timeout: {
      greaterThan: 50,
    },
    showMenu: true,
  },
];

const maxThresholdTimeout = swipeHoldThresholds.reduce(
  (max, threshold) =>
    Math.max(
      max,
      threshold.timeout.lessThan ?? threshold.timeout.greaterThan ?? 0,
    ),
  0,
);

export default function useHoldMenu<I extends MenuItem>({
  touchBuffer = 20,
  ...props
}: HoldMenuProps<I>) {
  const getTargetDirection = React.useMemo(
    () => withGetTargetDirection(props.menuItems),
    [props.menuItems],
  );

  const devIndicator = useFlag("HOLD_MENU_DEV_INDICATOR") === "enabled";
  const holdMenuBehaviour: "always-visible" | "hold" = useFlag(
    "HOLD_MENU_BEHAVIOUR",
  );
  const setPanResponderBehaviour = useFlag("HOLD_MENU_PAN_RESPONDER_BEHAVIOUR");
  const menuRef = React.useRef<View>(null);
  const opacity = React.useRef(
    new Animated.Value(holdMenuBehaviour === "always-visible" ? 1 : 0),
  ).current;
  const hoverIndicatorOpacity = React.useRef(new Animated.Value(0)).current;
  const hoverIndicatorX = React.useRef(new Animated.Value(0)).current;
  const hoverIndicatorY = React.useRef(new Animated.Value(0)).current;
  const [renderMenu, setRenderMenu] = React.useState(false);
  const [highlightedItemState, setHighlightedItem] = React.useState<I | null>(
    null,
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

  const updateMenuPosition = React.useCallback(() => {
    menuRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({ pageX, pageY });
    });
  }, []);

  React.useLayoutEffect(updateMenuPosition, [updateMenuPosition]);

  const getDraggedDirection = (
    gestureState: PanResponderGestureState,
  ): MenuItem<I> | null => {
    if (!menuPositionRef.current) return null;

    if (devIndicator) {
      const touchX = gestureState.moveX - menuPositionRef.current.pageX;
      const touchY = gestureState.moveY - menuPositionRef.current.pageY;

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

    return getTargetDirection(gestureState);
  };

  const horizontalDistance = React.useRef<null | {
    distance: number;
    since: Date;
    timeout?: NodeJS.Timeout;
  }>(null);

  const renderMenuRef = React.useRef(renderMenu);
  renderMenuRef.current = renderMenu;

  function showHoldMenu() {
    if (renderMenuRef.current) return;

    // This accounts for scroll views and stuff.
    updateMenuPosition();
    setHighlightedItem(null);
    opacity.setValue(0);
    setRenderMenu(true);
    renderMenuRef.current = true;

    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeInDuration,
      useNativeDriver: true,
    }).start();

    if (devIndicator) {
      // Show hover indicator
      Animated.timing(hoverIndicatorOpacity, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }).start();
    }
  }

  function hideHoldMenu(gestureState?: PanResponderGestureState) {
    if (!renderMenuRef.current) return;

    if (gestureState) {
      const item = getDraggedDirection(gestureState);

      if (item && !actionHandled.current) {
        props.handleAction(item);
        actionHandled.current = true;
      }
    }

    setHighlightedItem(null);

    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeOutDuration,
      useNativeDriver: true,
    }).start(() => {
      renderMenuRef.current = false;
      setRenderMenu(false);
    });

    if (devIndicator) {
      // Hide hover indicator
      Animated.timing(hoverIndicatorOpacity, {
        toValue: 0,
        duration: fadeOutDuration,
        useNativeDriver: true,
      }).start();
    }
  }

  const panStartTime = React.useRef<number | null>(null);
  const actionHandled = React.useRef<boolean | null>(null);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (setPanResponderBehaviour === "always-set") return true;

        // If it's already visible grant access
        if (renderMenuRef.current) return true;

        return false;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const now = new Date();

        // If we don't have any recent data, reset the state
        if (
          !horizontalDistance.current ||
          now.getTime() - horizontalDistance.current.since.getTime() >
            maxThresholdTimeout
        ) {
          horizontalDistance.current = {
            distance: gestureState.dx,
            since: now,
          };
        } else {
          horizontalDistance.current.distance += gestureState.dx;
        }

        const timeSince =
          now.getTime() - horizontalDistance.current.since.getTime();

        // This gets the distance travelled horizontally within our timeout
        const distance = Math.abs(horizontalDistance.current.distance);

        // Find a threshold that matches our current distance and time
        const threshold = swipeHoldThresholds.find((threshold) => {
          if (
            threshold.timeout.greaterThan &&
            timeSince < threshold.timeout.greaterThan
          ) {
            return false;
          }

          if (
            threshold.timeout.lessThan &&
            timeSince > threshold.timeout.lessThan
          ) {
            return false;
          }

          if (
            threshold.distance.greaterThan &&
            distance < threshold.distance.greaterThan
          ) {
            return false;
          }

          if (
            threshold.distance.lessThan &&
            distance > threshold.distance.lessThan
          ) {
            return false;
          }

          return true;
        });

        // Yay, we know what to do, do it
        if (threshold) {
          clearTimeout(horizontalDistance.current.timeout);

          horizontalDistance.current = {
            distance: 0,
            since: now,
          };

          // Keep waiting/ allow scrolling
          return threshold.showMenu;
        }

        return false;
      },

      onPanResponderGrant: () => {
        actionHandled.current = false;
        panStartTime.current = Date.now();
        showHoldMenu();
      },

      onPanResponderMove: (_, gestureState) => {
        const item = getDraggedDirection(gestureState);

        if (item && item.key !== highlightedItem?.key) {
          setHighlightedItem(item);
        } else if (!item) {
          setHighlightedItem(null);
        }
      },

      onPanResponderRelease: (event, gestureState) => {
        hideHoldMenu(gestureState);

        const timeOfPan = panStartTime.current
          ? Date.now() - panStartTime.current
          : null;

        const travelledDistance = getGestureDistance(gestureState);

        if (
          travelledDistance < maxDistanceForTap &&
          timeOfPan &&
          timeOfPan < maxTimeoutForTap &&
          !actionHandled.current
        ) {
          if (props.handlePress) {
            props.handlePress();
            actionHandled.current = true;
          }
        }

        panStartTime.current = null;
      },
    }),
  ).current;

  const onPointerEnter = React.useCallback(() => {
    setRenderMenu(true);

    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeInDuration,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const { getIsPointerOverRef } = usePointer();

  React.useEffect(() => {
    if (getIsPointerOverRef(menuRef)) {
      onPointerEnter();
    }
  }, [menuRef, onPointerEnter, getIsPointerOverRef]);

  const onPointerLeave = React.useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: fadeOutDuration,
      useNativeDriver: true,
    }).start(() => {
      setRenderMenu(false);
    });
  }, [opacity]);

  return {
    onPointerEnter:
      holdMenuBehaviour === "always-visible" ? undefined : onPointerEnter,
    onPointerLeave:
      holdMenuBehaviour === "always-visible" ? undefined : onPointerLeave,
    panResponder: holdMenuBehaviour === "hold" ? panResponder : undefined,
    menuRef,
    opacity,
    highlightedItem,
    holdMenuBehaviour,
    touchBuffer,
    devIndicator,
    devIndicatorStyle: {
      opacity: hoverIndicatorOpacity,
      transform: [
        { translateX: hoverIndicatorX },
        { translateY: hoverIndicatorY },
      ],
    },
  };
}
