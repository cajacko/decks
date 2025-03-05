import React from "react";
import {
  withSpring,
  withClamp,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { autoAnimateConfig } from "./bottomDrawer.style";

// NOTE: Debug logs don't work inside the pan events, even with runOnJs
export default function useDrag(props: {
  height: SharedValue<number>;
  maxHeight: number;
  maxAutoHeight: number;
  minHeight: number;
}) {
  const { height } = props;

  const pressed = useSharedValue<boolean>(false);
  const maxHeight = useSharedValue<number>(props.maxHeight);
  const maxAutoHeight = useSharedValue<number>(props.maxAutoHeight);
  const minHeight = useSharedValue<number>(props.minHeight);

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

  // Used to decide whether we have pressed or dragged
  const draggedDistance = useSharedValue(0);

  const drag = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      draggedDistance.value = 0;
    })
    .onChange((event) => {
      let newHeight = height.value - event.changeY * 10;

      draggedDistance.value = event.translationY;

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
      pressed.value = false;

      if (Math.abs(draggedDistance.value) > 10) {
        return;
      }

      // This is a press

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

      height.value = withSpring(
        moveTo === "top" ? maxAutoHeight.value : minHeight.value,
        autoAnimateConfig,
      );
    });

  return {
    pressed,
    drag,
  };
}
