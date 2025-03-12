import React from "react";
import { View } from "react-native";
import { MenuItem, HoldMenuProps, MenuPosition } from "./types";
import useFlag from "@/hooks/useFlag";
import usePointer from "@/hooks/usePointer";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  // useEvent,
} from "react-native-reanimated";
import {
  Gesture,
  // GestureStateChangeEvent,
  // GestureUpdateEvent,
  // PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const maxDistanceForTap = 10;
const minDistanceForDirection = maxDistanceForTap * 4;
const maxTimeoutForTap = 500;
const fadeInDuration = 100;
const fadeOutDuration = 200;

// function getGestureDistance(
//   event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
// ) {
//   return Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
// }
// function withGetTargetDirection<P extends object = object>(
//   menuItems: MenuItems<P>,
// ) {
//   return (
//     event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
//   ): MenuItem<P> | null => {
//     const distance = getGestureDistance(event);

//     if (distance < minDistanceForDirection) return null;

//     const { translationX, translationY } = event;

//     // Calculate the angle of movement
//     const angle = Math.atan2(translationX, translationY) * (180 / Math.PI);

//     // Determine the ideal direction based on the angle
//     let preferredDirection: MenuPosition;

//     if (angle >= -45 && angle < 45) {
//       preferredDirection = "right";
//     } else if (angle >= 45 && angle < 135) {
//       preferredDirection = "bottom";
//     } else if (angle >= -135 && angle < -45) {
//       preferredDirection = "top";
//     } else {
//       preferredDirection = "left";
//     }

//     // If the preferred direction is available, return it
//     if (menuItems[preferredDirection]) {
//       return menuItems[preferredDirection] ?? null;
//     }

//     return null;
//   };
// }

// NOTE: 50ms is the max we ever want to wait before showing the menu
// const swipeHoldThresholds: {
//   distance:
//     | {
//         greaterThan: number;
//         lessThan?: number;
//       }
//     | {
//         greaterThan?: number;
//         lessThan: number;
//       };
//   timeout:
//     | {
//         greaterThan: number;
//         lessThan?: number;
//       }
//     | {
//         greaterThan?: number;
//         lessThan: number;
//       };
//   showMenu: boolean;
// }[] = [
//   {
//     distance: {
//       lessThan: 1,
//     },
//     timeout: {
//       greaterThan: 20,
//     },
//     showMenu: true,
//   },
//   {
//     distance: {
//       lessThan: 10,
//     },
//     timeout: {
//       greaterThan: 50,
//     },
//     showMenu: true,
//   },
// ];

// const maxThresholdTimeout = swipeHoldThresholds.reduce(
//   (max, threshold) =>
//     Math.max(
//       max,
//       threshold.timeout.lessThan ?? threshold.timeout.greaterThan ?? 0,
//     ),
//   0,
// );

export default function useHoldMenu<I extends MenuItem>({
  touchBuffer = 20,
  ...props
}: HoldMenuProps<I>) {
  // const getTargetDirection = React.useMemo(
  //   () => withGetTargetDirection(props.menuItems),
  //   [props.menuItems],
  // );

  const devIndicator = useFlag("HOLD_MENU_DEV_INDICATOR") === "enabled";
  const holdMenuBehaviour: "always-visible" | "hold" = useFlag(
    "HOLD_MENU_BEHAVIOUR",
  );
  // const setPanResponderBehaviour = useFlag("HOLD_MENU_PAN_RESPONDER_BEHAVIOUR");
  const menuRef = React.useRef<View>(null);
  const opacity = useSharedValue(
    holdMenuBehaviour === "always-visible" ? 1 : 0,
  );
  const hoverIndicatorOpacity = useSharedValue(0);
  const devEndIndicator = useSharedValue({ x: 0, y: 0 });
  const devStartIndicator = useSharedValue({ x: 0, y: 0 });
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

  // const getDraggedDirection = (
  //   gestureState: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  // ): MenuItem<I> | null => {
  //   return getTargetDirection(gestureState);
  // };

  // const horizontalDistance = React.useRef<null | {
  //   distance: number;
  //   since: Date;
  //   timeout?: NodeJS.Timeout;
  // }>(null);

  const renderMenuRef = React.useRef(renderMenu);
  renderMenuRef.current = renderMenu;

  // function showHoldMenu() {
  //   if (renderMenuRef.current) return;

  //   // This accounts for scroll views and stuff.
  //   updateMenuPosition();
  //   setHighlightedItem(null);
  //   opacity.value = 0;
  //   setRenderMenu(true);
  //   renderMenuRef.current = true;

  //   opacity.value = withTiming(1, {
  //     duration: fadeInDuration,
  //   });

  //   if (devIndicator) {
  //     // Show hover indicator
  //     hoverIndicatorOpacity.value = withTiming(1, {
  //       duration: fadeInDuration,
  //     });
  //   }
  // }

  // function hideHoldMenu(gestureState?: PanResponderGestureState) {
  //   if (!renderMenuRef.current) return;

  //   if (gestureState) {
  //     const item = getDraggedDirection(gestureState);

  //     if (item && !actionHandled.current) {
  //       props.handleAction(item);
  //       actionHandled.current = true;
  //     }
  //   }

  //   setHighlightedItem(null);

  //   opacity.value = withTiming(
  //     0,
  //     {
  //       duration: fadeOutDuration,
  //     },
  //     () => {
  //       renderMenuRef.current = false;
  //       setRenderMenu(false);
  //     },
  //   );

  //   if (devIndicator) {
  //     // Hide hover indicator
  //     hoverIndicatorOpacity.value = withTiming(0, {
  //       duration: fadeOutDuration,
  //     });
  //   }
  // }

  const panStartTime = useSharedValue<number | null>(null);
  const actionHandled = useSharedValue(false);

  const activeDirection = useSharedValue<MenuPosition | null>(null);

  const pan = Gesture.Pan()
    .onBegin((event) => {
      opacity.value = withTiming(1, {
        duration: fadeInDuration,
      });

      if (devIndicator) {
        hoverIndicatorOpacity.value = 1;

        devStartIndicator.value = {
          x: event.x,
          y: event.y,
        };
      }

      actionHandled.value = false;
      panStartTime.value = Date.now();
    })
    .onChange((event) => {
      if (devIndicator) {
        devEndIndicator.value = {
          x: event.x,
          y: event.y,
        };
      }

      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2,
      );

      if (distance < minDistanceForDirection) {
        activeDirection.value = null;
      } else {
        const { translationX, translationY } = event;

        // Calculate the angle of movement
        const angle = Math.atan2(translationX, translationY) * (180 / Math.PI);

        if (angle >= -45 && angle < 45) {
          activeDirection.value = "bottom";
        } else if (angle >= 45 && angle < 135) {
          activeDirection.value = "right";
        } else if (angle >= -135 && angle < -45) {
          activeDirection.value = "left";
        } else {
          activeDirection.value = "top";
        }
      }
    })
    .onFinalize((event) => {
      if (devIndicator) {
        devEndIndicator.value = {
          x: withSpring(devStartIndicator.value.x),
          y: withSpring(devStartIndicator.value.y),
        };

        hoverIndicatorOpacity.value = withSpring(0);
      }

      opacity.value = withTiming(0, {
        duration: fadeOutDuration,
      });

      const distance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2,
      );

      const timeOfPan = panStartTime.value
        ? Date.now() - panStartTime.value
        : null;

      if (
        distance < maxDistanceForTap &&
        timeOfPan &&
        timeOfPan < maxTimeoutForTap &&
        !actionHandled.value
      ) {
        runOnJS(props.handlePress || (() => undefined))();

        actionHandled.value = true;
        return;
      }

      const finalItem =
        activeDirection.value && props.menuItems[activeDirection.value];

      if (finalItem) {
        runOnJS(setHighlightedItem)(finalItem); // Update highlighted item on the main thread
        runOnJS(props.handleAction)(finalItem); // Execute action
        actionHandled.value = true;
      } else {
        runOnJS(setHighlightedItem)(null); // Reset if no item is selected
      }

      activeDirection.value = null;
    });

  // const panResponder = React.useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => {
  //       if (setPanResponderBehaviour === "always-set") return true;

  //       // If it's already visible grant access
  //       if (renderMenuRef.current) return true;

  //       return false;
  //     },
  //     onMoveShouldSetPanResponder: (_, gestureState) => {
  //       const now = new Date();

  //       // If we don't have any recent data, reset the state
  //       if (
  //         !horizontalDistance.current ||
  //         now.getTime() - horizontalDistance.current.since.getTime() >
  //           maxThresholdTimeout
  //       ) {
  //         horizontalDistance.current = {
  //           distance: gestureState.dx,
  //           since: now,
  //         };
  //       } else {
  //         horizontalDistance.current.distance += gestureState.dx;
  //       }

  //       const timeSince =
  //         now.getTime() - horizontalDistance.current.since.getTime();

  //       // This gets the distance travelled horizontally within our timeout
  //       const distance = Math.abs(horizontalDistance.current.distance);

  //       // Find a threshold that matches our current distance and time
  //       const threshold = swipeHoldThresholds.find((threshold) => {
  //         if (
  //           threshold.timeout.greaterThan &&
  //           timeSince < threshold.timeout.greaterThan
  //         ) {
  //           return false;
  //         }

  //         if (
  //           threshold.timeout.lessThan &&
  //           timeSince > threshold.timeout.lessThan
  //         ) {
  //           return false;
  //         }

  //         if (
  //           threshold.distance.greaterThan &&
  //           distance < threshold.distance.greaterThan
  //         ) {
  //           return false;
  //         }

  //         if (
  //           threshold.distance.lessThan &&
  //           distance > threshold.distance.lessThan
  //         ) {
  //           return false;
  //         }

  //         return true;
  //       });

  //       // Yay, we know what to do, do it
  //       if (threshold) {
  //         clearTimeout(horizontalDistance.current.timeout);

  //         horizontalDistance.current = {
  //           distance: 0,
  //           since: now,
  //         };

  //         // Keep waiting/ allow scrolling
  //         return threshold.showMenu;
  //       }

  //       return false;
  //     },

  //     onPanResponderGrant: () => {
  //       actionHandled.current = false;
  //       panStartTime.current = Date.now();
  //       showHoldMenu();
  //     },

  //     onPanResponderMove: (_, gestureState) => {
  //       const item = getDraggedDirection(gestureState);

  //       if (item && item.key !== highlightedItem?.key) {
  //         setHighlightedItem(item);
  //       } else if (!item) {
  //         setHighlightedItem(null);
  //       }
  //     },

  //     onPanResponderRelease: (event, gestureState) => {
  //       hideHoldMenu(gestureState);

  //       const timeOfPan = panStartTime.current
  //         ? Date.now() - panStartTime.current
  //         : null;

  //       const travelledDistance = getGestureDistance(gestureState);

  //       if (
  //         travelledDistance < maxDistanceForTap &&
  //         timeOfPan &&
  //         timeOfPan < maxTimeoutForTap &&
  //         !actionHandled.current
  //       ) {
  //         if (props.handlePress) {
  //           props.handlePress();
  //           actionHandled.current = true;
  //         }
  //       }

  //       panStartTime.current = null;
  //     },
  //   }),
  // ).current;

  const onPointerEnter = React.useCallback(() => {
    setRenderMenu(true);

    opacity.value = withTiming(1, {
      duration: fadeInDuration,
    });
  }, [opacity]);

  const { getIsPointerOverRef } = usePointer();

  React.useEffect(() => {
    if (getIsPointerOverRef(menuRef)) {
      onPointerEnter();
    }
  }, [menuRef, onPointerEnter, getIsPointerOverRef]);

  const onPointerLeave = React.useCallback(() => {
    opacity.value = withTiming(
      0,
      {
        duration: fadeOutDuration,
      },
      () => {
        setRenderMenu(false);
      },
    );
  }, [opacity]);

  const devIndicatorStartStyle = useAnimatedStyle(() => ({
    opacity: hoverIndicatorOpacity.value,
    transform: [
      { translateX: devStartIndicator.value.x },
      { translateY: devStartIndicator.value.y },
    ],
  }));

  const devIndicatorEndStyle = useAnimatedStyle(() => ({
    opacity: hoverIndicatorOpacity.value,
    transform: [
      { translateX: devEndIndicator.value.x },
      { translateY: devEndIndicator.value.y },
    ],
  }));

  return {
    onPointerEnter:
      holdMenuBehaviour === "always-visible" ? undefined : onPointerEnter,
    onPointerLeave:
      holdMenuBehaviour === "always-visible" ? undefined : onPointerLeave,
    // panResponder: holdMenuBehaviour === "hold" ? panResponder : undefined,
    pan,
    menuRef,
    opacity,
    highlightedItem,
    holdMenuBehaviour,
    touchBuffer,
    devIndicator,
    devIndicatorEndStyle,
    devIndicatorStartStyle,
    activeDirection,
  };
}
