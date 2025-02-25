import {
  withSpring,
  withClamp,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { autoAnimateConfig } from "./bottomDrawer.style";

export default function useDrag(props: {
  height: SharedValue<number>;
  maxHeight: SharedValue<number>;
  maxAutoHeight: SharedValue<number>;
  minHeight: SharedValue<number>;
  pressed: SharedValue<boolean>;
}) {
  const { pressed, height, maxAutoHeight, maxHeight, minHeight } = props;

  // Used to decide whether we have pressed or dragged
  const draggedDistance = useSharedValue(0);

  return Gesture.Pan()
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

      if (Math.abs(draggedDistance.value) > 10) return;

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
}
