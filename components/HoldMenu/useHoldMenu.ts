import React from "react";
import { View } from "react-native";
import { HoldMenuProps, MenuPosition } from "./types";
import useFlag from "@/hooks/useFlag";
import usePointer from "@/hooks/usePointer";
import {
  useSharedValue,
  useAnimatedStyle,
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
const scaleSize = 1.05;
const scaleDuration = 200;
const showMenuDelay = 500;

export default function useHoldMenu({
  touchBuffer = 20,
  ...props
}: HoldMenuProps) {
  const devIndicator = useFlag("HOLD_MENU_DEV_INDICATOR") === "enabled";
  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const holdMenuBehaviour = useFlag("HOLD_MENU_BEHAVIOUR");
  const alwaysShowCardActions =
    useFlag("CARD_ACTIONS_ALWAYS_VISIBLE") === true ||
    holdMenuBehaviour === "always-visible";
  const menuRef = React.useRef<View>(null);
  const menuOpacity = useSharedValue(0);
  const devIndicatorOpacity = useSharedValue(0);
  const devEndIndicator = useSharedValue({ x: 0, y: 0 });
  const devStartIndicator = useSharedValue({ x: 0, y: 0 });
  const [highlightedPosition, setHighlightedPosition] =
    React.useState<MenuPosition | null>(null);
  const isHovering = useSharedValue(false);
  const scale = useSharedValue(1);
  const panStartTime = useSharedValue<number | null>(null);
  const panActionHandled = useSharedValue<null | boolean>(null);
  const activeDirectionSharedValue = useSharedValue<MenuPosition | null>(null);
  const scaleUpFinished = useSharedValue(true);
  const menuOpacityTimer = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin((event) => {
      if (isHovering.value) return;

      panActionHandled.value = false;
      scaleUpFinished.value = false;
      panStartTime.value = Date.now();

      if (canAnimateCards) {
        scale.value = withTiming(scaleSize, { duration: scaleDuration }, () => {
          scaleUpFinished.value = true;

          if (panStartTime.value === null) {
            scale.value = withTiming(1, { duration: scaleDuration });
          }
        });
      }

      // Doing our timers like this keeps things working in the way reanimated works with their
      // worklets
      menuOpacityTimer.value = withTiming(
        menuOpacityTimer.value === 0 ? 1 : 0,
        {
          duration: showMenuDelay,
        },
        () => {
          // If the pan has finished do nothing
          if (panStartTime.value === null) return;

          menuOpacity.value = withTiming(1, {
            duration: fadeInDuration,
          });
        },
      );

      if (devIndicator) {
        devIndicatorOpacity.value = 1;

        devStartIndicator.value = {
          x: event.x,
          y: event.y,
        };
      }
    })
    .onChange((event) => {
      if (isHovering.value) return;

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
        const angle = Math.atan2(translationX, translationY) * (180 / Math.PI);

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
    .onFinalize((event) => {
      if (isHovering.value) return;

      const timeOfPan = panStartTime.value
        ? Date.now() - panStartTime.value
        : null;

      panStartTime.value = null;

      if (scaleUpFinished.value && canAnimateCards) {
        scale.value = withTiming(1, { duration: scaleDuration });
      }

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

      const totalPanDistance = Math.sqrt(
        event.translationX ** 2 + event.translationY ** 2,
      );

      const isATapAction =
        totalPanDistance < maxDistanceForTap &&
        timeOfPan &&
        timeOfPan < maxTimeoutForTap &&
        !panActionHandled.value;

      if (isATapAction) {
        runOnJS(props.handlePress || (() => undefined))();

        panActionHandled.value = true;
      } else {
        const selectedActionItem =
          activeDirectionSharedValue.value &&
          props.menuItems[activeDirectionSharedValue.value];

        // We have dragged and selected an action, run it
        if (selectedActionItem) {
          runOnJS(selectedActionItem.handleAction)();
          panActionHandled.value = true;
        }
      }

      // Clear up
      runOnJS(setHighlightedPosition)(null);
      activeDirectionSharedValue.value = null;
    });

  const onPointerEnter = React.useCallback(() => {
    // This fires constantly as moving over the hold menu, so ignore
    if (isHovering.value) return;

    isHovering.value = true;

    menuOpacity.value = withTiming(1, {
      duration: fadeInDuration,
    });
  }, [menuOpacity, isHovering]);

  const onPointerLeave = React.useCallback(() => {
    isHovering.value = false;

    menuOpacity.value = withTiming(0, {
      duration: fadeOutDuration,
    });
  }, [menuOpacity, isHovering]);

  const { getIsPointerOverRef } = usePointer();

  React.useEffect(() => {
    if (!getIsPointerOverRef(menuRef)) return;

    onPointerEnter();
  }, [menuRef, onPointerEnter, getIsPointerOverRef]);

  const devIndicatorStartStyle = useAnimatedStyle(() => ({
    opacity: devIndicatorOpacity.value,
    transform: [
      { translateX: devStartIndicator.value.x },
      { translateY: devStartIndicator.value.y },
    ],
  }));

  const devIndicatorEndStyle = useAnimatedStyle(() => ({
    opacity: devIndicatorOpacity.value,
    transform: [
      { translateX: devEndIndicator.value.x },
      { translateY: devEndIndicator.value.y },
    ],
  }));

  return {
    onPointerEnter: alwaysShowCardActions ? undefined : onPointerEnter,
    onPointerLeave: alwaysShowCardActions ? undefined : onPointerLeave,
    alwaysShowCardActions,
    pan: holdMenuBehaviour === "hold/hover" ? pan : undefined,
    menuRef,
    menuOpacity,
    highlightedPosition,
    devIndicator,
    devIndicatorEndStyle,
    devIndicatorStartStyle,
    scale,
  };
}
