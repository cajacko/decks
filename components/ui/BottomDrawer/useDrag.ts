import React from "react";
import {
  withSpring,
  withClamp,
  SharedValue,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { autoAnimateConfig } from "./bottomDrawer.style";
import useFlag from "@/hooks/useFlag";

// NOTE: Debug logs don't work inside the pan events, even with runOnJs
export default function useDrag(props: {
  height: SharedValue<number>;
  maxHeight: number;
  maxAutoHeight: number;
  minHeight: number;
}) {
  const canAnimate = useFlag("BOTTOM_DRAWER_ANIMATE") === "enabled";
  const canDrag = useFlag("BOTTOM_DRAWER_DRAG") === "enabled";

  const { height } = props;

  const maxHeight = useSharedValue<number>(props.maxHeight);
  const maxAutoHeight = useSharedValue<number>(props.maxAutoHeight);
  const minHeight = useSharedValue<number>(props.minHeight);
  const isPanning = useSharedValue<boolean>(false);
  const isHolding = useSharedValue<boolean>(false);
  const isHovering = useSharedValue<boolean>(false);

  const pressed = useDerivedValue(() => {
    return isHolding.value || isPanning.value || isHovering.value;
  });

  // Keep our shared values in sync with the props
  React.useEffect(() => {
    maxHeight.value = props.maxHeight;
    maxAutoHeight.value = props.maxAutoHeight;
    minHeight.value = props.minHeight;
  }, [
    props.maxHeight,
    props.maxAutoHeight,
    props.minHeight,
    maxHeight,
    maxAutoHeight,
    minHeight,
  ]);

  const holding = React.useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(0)
        .maxDistance(10000)
        .onStart(() => {
          isHolding.value = true;
        })
        .onEnd(() => {
          isHolding.value = false;
        }),
    [isHolding],
  );

  const hovering = React.useMemo(
    () =>
      Gesture.Hover()
        .onStart(() => {
          isHovering.value = true;
        })
        .onEnd(() => {
          isHovering.value = false;
        }),
    [isHovering],
  );

  const tap = React.useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        let moveTo: "top" | "bottom";

        const distanceToTop = height.value - minHeight.value;
        const distanceToBottom = maxAutoHeight.value - height.value;

        if (height.value >= maxAutoHeight.value) {
          moveTo = "bottom";
        } else if (distanceToTop < distanceToBottom) {
          moveTo = "top";
        } else {
          moveTo = "bottom";
        }

        const newHeight =
          moveTo === "top" ? maxAutoHeight.value : minHeight.value;

        if (!canAnimate) {
          height.value = newHeight;

          return;
        }

        height.value = withSpring(newHeight, autoAnimateConfig);
      }),
    [canAnimate, height, maxAutoHeight, minHeight],
  );

  const panStartHeight = useSharedValue(0);

  const drag = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(canDrag)
        .onStart(() => {
          isPanning.value = true;
          panStartHeight.value = height.value;
        })
        .onChange((event) => {
          // This is more accurate than going off the change value on each onChange (just in case an
          // event is dropped)
          const newHeight = panStartHeight.value - event.translationY;

          height.value = withClamp(
            {
              max: maxHeight.value,
              min: minHeight.value,
            },
            withSpring(newHeight, {
              damping: 20,
              stiffness: 300,
            }),
          );
        })
        .onFinalize(() => {
          isPanning.value = false;
        }),
    [height, maxHeight, minHeight, canDrag, isPanning, panStartHeight],
  );

  const composed = React.useMemo(
    () => Gesture.Simultaneous(holding, hovering, Gesture.Exclusive(drag, tap)),
    [holding, drag, hovering, tap],
  );

  return {
    pressed,
    drag: composed,
  };
}
