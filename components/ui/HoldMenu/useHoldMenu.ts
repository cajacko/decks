import React from "react";
import { HoldMenuProps, MenuPosition } from "./types";
import useFlag from "@/hooks/useFlag";
import {
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import useVibrate from "@/hooks/useVibrate";

const maxDistanceForTap = 10;
const minDistanceForDirection = maxDistanceForTap * 4;
const maxTimeoutForTap = 500;
const fadeInDuration = 500;
const fadeOutDuration = 200;
const scaleSize = 1.02;
const scaleDuration = 200;
const showMenuDelay = 200;
const longPressDuration = 1000;

export default function useHoldMenu({
  handleLongPress,
  menuItems,
  handleDoubleTap,
  hideActions,
}: HoldMenuProps) {
  // Flags
  const devIndicator = useFlag("HOLD_MENU_DEV_INDICATOR") === "enabled";
  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const holdMenuBehaviour = useFlag("HOLD_MENU_BEHAVIOUR");
  const alwaysShowCardActions =
    useFlag("CARD_ACTIONS_ALWAYS_VISIBLE") === true ||
    holdMenuBehaviour === "always-visible";

  const _menuOpacityOverride = alwaysShowCardActions
    ? 1
    : hideActions
      ? 0
      : null;

  // Shared values
  const menuOpacity = useSharedValue(0);
  const menuOpacityOverride = useSharedValue<null | number>(
    _menuOpacityOverride,
  );
  const devIndicatorOpacity = useSharedValue(0);
  const devEndIndicator = useSharedValue({ x: 0, y: 0 });
  const devStartIndicator = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const activeDirectionSharedValue = useSharedValue<MenuPosition | null>(null);
  const scaleUpFinished = useSharedValue(true);
  const isTouching = useSharedValue(false);
  const longPressTransition = useSharedValue(0);

  React.useEffect(() => {
    menuOpacityOverride.value = _menuOpacityOverride;
  }, [_menuOpacityOverride, menuOpacityOverride]);

  // State
  const [highlightedPosition, setHighlightedPosition] =
    React.useState<MenuPosition | null>(null);

  const { clearPendingVibrations, vibrate } = useVibrate();

  const throttledVibrate = React.useCallback(
    (debugKey: string, delay?: number) => {
      vibrate?.(debugKey, {
        delay,
        throttle: 300,
      });
    },
    [vibrate],
  );

  const onLongPress = React.useMemo(
    () =>
      handleLongPress
        ? () => {
            throttledVibrate("handleLongPress");
            handleLongPress();
          }
        : undefined,
    [handleLongPress, throttledVibrate],
  );

  const onDoubleTap = React.useMemo(
    () =>
      handleDoubleTap
        ? () => {
            throttledVibrate("handleDoubleTap");
            handleDoubleTap();
          }
        : undefined,
    [handleDoubleTap, throttledVibrate],
  );

  const onTap = React.useCallback(
    () => throttledVibrate("tap"),
    [throttledVibrate],
  );

  const onTouch = React.useCallback(
    () => throttledVibrate("touch", 150),
    [throttledVibrate],
  );

  const onHighlight = React.useCallback(
    (activeDirection: string) =>
      throttledVibrate(`highlight: ${activeDirection}`),
    [throttledVibrate],
  );

  const onAction = React.useCallback(
    () => throttledVibrate("action"),
    [throttledVibrate],
  );

  // Gestures

  // Run handlePress on tap
  const tap = React.useMemo(
    () =>
      Gesture.Tap()
        .maxDuration(maxTimeoutForTap)
        .maxDistance(10000)
        .shouldCancelWhenOutside(false)
        .onEnd(() => {
          runOnJS(onTap)();

          menuOpacity.value = withTiming(menuOpacity.value === 1 ? 0 : 1, {
            duration:
              menuOpacity.value === 1 ? fadeOutDuration : fadeInDuration,
          });
        }),

    [menuOpacity, onTap],
  );

  const doubleTap = React.useMemo(
    () =>
      Gesture.Tap()
        .enabled(!!onDoubleTap)
        .maxDuration(maxTimeoutForTap)
        .numberOfTaps(2)
        .maxDistance(10000)
        .shouldCancelWhenOutside(false)
        .onEnd(() => {
          if (!onDoubleTap) return;

          runOnJS(onDoubleTap)();
        }),

    [onDoubleTap],
  );

  // Scale the card up when touching
  const touching = React.useMemo(() => {
    return Gesture.LongPress()
      .enabled(holdMenuBehaviour !== "always-visible" && canAnimateCards)
      .minDuration(0)
      .maxDistance(10000)
      .shouldCancelWhenOutside(false)
      .onStart(() => {
        isTouching.value = true;
        scaleUpFinished.value = false;

        runOnJS(onTouch)();

        scale.value = withTiming(scaleSize, { duration: scaleDuration }, () => {
          scaleUpFinished.value = true;

          if (!isTouching.value) {
            scale.value = withTiming(1, { duration: scaleDuration });
          }
        });
      })
      .onEnd(() => {
        isTouching.value = false;

        if (clearPendingVibrations) {
          runOnJS(clearPendingVibrations)();
        }

        if (!scaleUpFinished.value) return;

        scale.value = withTiming(1, { duration: scaleDuration });
      });
  }, [
    holdMenuBehaviour,
    canAnimateCards,
    scaleUpFinished,
    isTouching,
    scale,
    onTouch,
    clearPendingVibrations,
  ]);

  // Show the menu on hover
  const hover = React.useMemo(
    () =>
      Gesture.Hover()
        .enabled(!alwaysShowCardActions)
        .onStart(() => {
          menuOpacity.value = withTiming(1, {
            duration: fadeInDuration,
          });
        })
        .onEnd((event) => {
          menuOpacity.value = withTiming(0, {
            duration: fadeOutDuration,
          });
        }),
    [alwaysShowCardActions, menuOpacity],
  );

  // Show the menu on a long press
  const longPress = React.useMemo(() => {
    return Gesture.LongPress()
      .enabled(!!onLongPress)
      .minDuration(longPressDuration)
      .maxDistance(10000)
      .shouldCancelWhenOutside(false)
      .onBegin(() => {
        longPressTransition.value = withTiming(1, {
          duration: longPressDuration,
        });
      })
      .onStart(() => {
        if (!onLongPress) return;

        runOnJS(onLongPress)();
      })
      .onFinalize(() => {
        longPressTransition.value = 0;
      });
  }, [onLongPress, longPressTransition]);

  // Show the menu on a long press
  const menuLongPress = React.useMemo(() => {
    return Gesture.LongPress()
      .enabled(holdMenuBehaviour !== "always-visible")
      .minDuration(showMenuDelay)
      .maxDistance(10000)
      .shouldCancelWhenOutside(false)
      .onStart(() => {
        menuOpacity.value = withTiming(1, {
          duration: fadeInDuration,
        });
      })
      .onEnd(() => {
        menuOpacity.value = withTiming(0, {
          duration: fadeOutDuration,
        });
      });
  }, [menuOpacity, holdMenuBehaviour]);

  const pan = React.useMemo(() => {
    return Gesture.Pan()
      .enabled(holdMenuBehaviour === "hold/hover")
      .onStart((event) => {
        if (devIndicator) {
          devIndicatorOpacity.value = 1;

          devStartIndicator.value = {
            x: event.x,
            y: event.y,
          };
        }
      })
      .onUpdate((event) => {
        if (devIndicator) {
          devEndIndicator.value = {
            x: event.x,
            y: event.y,
          };
        }

        const distance = Math.sqrt(
          event.translationX ** 2 + event.translationY ** 2,
        );

        let activeDirection: MenuPosition | null;

        if (distance < minDistanceForDirection) {
          activeDirection = null;
        } else {
          const { translationX, translationY } = event;

          // Calculate the angle of movement
          const angle =
            Math.atan2(translationX, translationY) * (180 / Math.PI);

          if (angle >= -45 && angle < 45) {
            activeDirection = "bottom";
          } else if (angle >= 45 && angle < 135) {
            activeDirection = "right";
          } else if (angle >= -135 && angle < -45) {
            activeDirection = "left";
          } else {
            activeDirection = "top";
          }
        }

        if (activeDirectionSharedValue.value !== activeDirection) {
          runOnJS(setHighlightedPosition)(activeDirection);
          activeDirectionSharedValue.value = activeDirection;

          if (activeDirection) {
            const selectedActionItem = menuItems?.[activeDirection];

            if (selectedActionItem) {
              runOnJS(onHighlight)(activeDirection);
            }
          }
        }
      })
      .onEnd(() => {
        if (devIndicator) {
          devEndIndicator.value = {
            x: withSpring(devStartIndicator.value.x),
            y: withSpring(devStartIndicator.value.y),
          };

          devIndicatorOpacity.value = withSpring(0);
        }

        menuOpacity.value = withTiming(0, {
          duration: fadeOutDuration,
        });

        const selectedActionItem =
          activeDirectionSharedValue.value &&
          menuItems?.[activeDirectionSharedValue.value];

        // We have dragged and selected an action, run it
        if (selectedActionItem) {
          runOnJS(selectedActionItem.handleAction)();
          runOnJS(onAction)();
        }

        // Clear up
        runOnJS(setHighlightedPosition)(null);
        activeDirectionSharedValue.value = null;
      });
  }, [
    holdMenuBehaviour,
    activeDirectionSharedValue,
    devIndicator,
    devEndIndicator,
    devIndicatorOpacity,
    devStartIndicator,
    menuOpacity,
    menuItems,
    onHighlight,
    onAction,
  ]);

  // Defines the priorities of gestures and how they work together
  const gesture = React.useMemo(() => {
    return Gesture.Simultaneous(
      touching,
      longPress,
      Gesture.Race(
        Gesture.Exclusive(doubleTap, tap),
        Gesture.Race(hover, Gesture.Simultaneous(menuLongPress, pan)),
      ),
    );
  }, [tap, menuLongPress, pan, hover, touching, longPress, doubleTap]);

  const menuTaps = React.useMemo(
    () => ({
      top: Gesture.Tap()
        .enabled(!!menuItems?.top)
        .onEnd(() => {
          if (!menuItems?.top) return;

          runOnJS(menuItems.top.handleAction)();
          runOnJS(onAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      bottom: Gesture.Tap()
        .enabled(!!menuItems?.bottom)
        .onEnd(() => {
          if (!menuItems?.bottom) return;

          runOnJS(menuItems.bottom.handleAction)();
          runOnJS(onAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      left: Gesture.Tap()
        .enabled(!!menuItems?.left)
        .onEnd(() => {
          if (!menuItems?.left) return;

          runOnJS(menuItems.left.handleAction)();
          runOnJS(onAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      right: Gesture.Tap()
        .enabled(!!menuItems?.right)
        .onEnd(() => {
          if (!menuItems?.right) return;

          runOnJS(menuItems.right.handleAction)();
          runOnJS(onAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
    }),
    [menuItems, gesture, onAction],
  );

  return {
    alwaysShowCardActions,
    gesture,
    menuOpacity,
    highlightedPosition,
    devIndicator,
    devEndIndicator,
    devIndicatorOpacity,
    devStartIndicator,
    scale,
    menuTaps,
    longPressTransition,
    menuOpacityOverride,
  };
}
