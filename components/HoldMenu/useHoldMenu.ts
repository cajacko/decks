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

const maxDistanceForTap = 10;
const minDistanceForDirection = maxDistanceForTap * 4;
const maxTimeoutForTap = 500;
const fadeInDuration = 500;
const fadeOutDuration = 200;
const scaleSize = 1.02;
const scaleDuration = 200;
const showMenuDelay = 200;

export default function useHoldMenu({ handlePress, menuItems }: HoldMenuProps) {
  // Flags
  const devIndicator = useFlag("HOLD_MENU_DEV_INDICATOR") === "enabled";
  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const holdMenuBehaviour = useFlag("HOLD_MENU_BEHAVIOUR");
  const alwaysShowCardActions =
    useFlag("CARD_ACTIONS_ALWAYS_VISIBLE") === true ||
    holdMenuBehaviour === "always-visible";

  // Shared values
  const menuOpacity = useSharedValue(0);
  const devIndicatorOpacity = useSharedValue(0);
  const devEndIndicator = useSharedValue({ x: 0, y: 0 });
  const devStartIndicator = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const activeDirectionSharedValue = useSharedValue<MenuPosition | null>(null);
  const scaleUpFinished = useSharedValue(true);
  const isTouching = useSharedValue(false);

  // State
  const [highlightedPosition, setHighlightedPosition] =
    React.useState<MenuPosition | null>(null);

  // Gestures

  // Run handlePress on tap
  const tap = React.useMemo(
    () =>
      Gesture.Tap()
        .enabled(!!handlePress)
        .maxDuration(maxTimeoutForTap)
        .maxDistance(10000)
        .shouldCancelWhenOutside(false)
        .onEnd(() => {
          if (!handlePress) return;

          runOnJS(handlePress)();
        }),

    [handlePress],
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

        scale.value = withTiming(scaleSize, { duration: scaleDuration }, () => {
          scaleUpFinished.value = true;

          if (!isTouching.value) {
            scale.value = withTiming(1, { duration: scaleDuration });
          }
        });
      })
      .onEnd(() => {
        isTouching.value = false;

        if (!scaleUpFinished.value) return;

        scale.value = withTiming(1, { duration: scaleDuration });
      });
  }, [holdMenuBehaviour, canAnimateCards, scaleUpFinished, isTouching, scale]);

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
          menuItems[activeDirectionSharedValue.value];

        // We have dragged and selected an action, run it
        if (selectedActionItem) {
          runOnJS(selectedActionItem.handleAction)();
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
  ]);

  // Defines the priorities of gestures and how they work together
  const gesture = React.useMemo(() => {
    return Gesture.Simultaneous(
      touching,
      Gesture.Race(
        tap,
        Gesture.Race(hover, Gesture.Simultaneous(longPress, pan)),
      ),
    );
  }, [tap, longPress, pan, hover, touching]);

  const menuTaps = React.useMemo(
    () => ({
      top: Gesture.Tap()
        .enabled(!!menuItems.top)
        .onEnd(() => {
          if (!menuItems.top) return;

          runOnJS(menuItems.top.handleAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      bottom: Gesture.Tap()
        .enabled(!!menuItems.bottom)
        .onEnd(() => {
          if (!menuItems.bottom) return;

          runOnJS(menuItems.bottom.handleAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      left: Gesture.Tap()
        .enabled(!!menuItems.left)
        .onEnd(() => {
          if (!menuItems.left) return;

          runOnJS(menuItems.left.handleAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
      right: Gesture.Tap()
        .enabled(!!menuItems.right)
        .onEnd(() => {
          if (!menuItems.right) return;

          runOnJS(menuItems.right.handleAction)();
        })
        .blocksExternalGesture(...gesture.toGestureArray()),
    }),
    [menuItems, gesture],
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
  };
}
