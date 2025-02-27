import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import useSetupRef from "./useOpenClose";
import useHeightConstraints from "./useHeightConstraints";
import useAnimatedStyles from "./useAnimatedStyles";
import useDrag from "./useDrag";

export default function useBottomDrawer(
  props: Omit<BottomDrawerProps, "children">,
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height, openOnMount = false } = props;
  const pressed = useSharedValue<boolean>(false);

  const {
    maxAutoHeight,
    onContentLayout,
    minHeight,
    maxHeight,
    hasGotMaxHeight,
  } = useHeightConstraints(props);

  useSetupRef(
    {
      height,
      maxAutoHeight,
      minHeight,
      hasGotMaxHeight,
      openOnMount,
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
