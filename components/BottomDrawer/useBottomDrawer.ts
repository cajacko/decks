import React from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import useSetupRef from "./useOpenClose";
import useHeightConstraints from "./useHeightConstraints";
import useAnimatedStyles from "./useAnimatedStyles";
import useDrag from "./useDrag";
import { dragBuffer, dragHeight, dragOverlap } from "./bottomDrawer.style";

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

  const bottom = useSharedValue(
    props.animateIn ? -props.initHeight - dragHeight : 0,
  );

  React.useEffect(() => {
    if (!props.animateIn) return;

    bottom.value = withTiming(0, { duration: 500 });
  }, [bottom, props.animateIn]);

  const animatedStyles = useAnimatedStyles({ height, pressed, bottom });

  return {
    drag,
    onContentLayout,
    animatedStyles,
  };
}
