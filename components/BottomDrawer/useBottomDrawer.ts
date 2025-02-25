import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import useSetupRef from "./useSetupRef";
import useHeightConstraints from "./useHeightConstraints";
import useAnimatedStyles from "./useAnimatedStyles";
import useDrag from "./useDrag";

export default function useBottomDrawer(
  props: Omit<BottomDrawerProps, "children">,
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height } = props;
  const pressed = useSharedValue<boolean>(false);

  const { maxAutoHeight, onContentLayout, minHeight, maxHeight } =
    useHeightConstraints(props);

  useSetupRef(
    {
      height,
      maxAutoHeight,
      minHeight,
    },
    ref,
  );

  const drag = useDrag({
    height,
    maxAutoHeight,
    maxHeight,
    minHeight,
    pressed,
  });

  const animatedStyles = useAnimatedStyles({ height, pressed });

  return {
    drag,
    onContentLayout,
    animatedStyles,
  };
}
