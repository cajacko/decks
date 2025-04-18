import React from "react";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import useOpenClose from "./useOpenClose";
import useHeightConstraints from "./useHeightConstraints";
import useAnimatedStyles from "./useAnimatedStyles";
import useDrag from "./useDrag";
import debugLog from "./debugLog";

export default function useBottomDrawer(
  props: Omit<BottomDrawerProps, "children">,
  ref: React.Ref<BottomDrawerRef>,
) {
  const {
    height,
    openOnMount = false,
    animateIn = false,
    initHeight,
    onRequestClose,
  } = props;

  React.useEffect(() => {
    debugLog("mounted");

    return () => {
      debugLog("unmounted");
    };
  }, []);

  const {
    maxAutoHeight,
    onContentLayout,
    minHeight,
    maxHeight,
    hasGotMaxHeight,
  } = useHeightConstraints(props);

  const { bottom } = useOpenClose(
    {
      height,
      maxAutoHeight,
      minHeight,
      hasGotMaxHeight,
      openOnMount,
      animateIn,
      initHeight,
      onRequestClose,
    },
    ref,
  );

  const { drag, pressed } = useDrag({
    height,
    maxAutoHeight,
    maxHeight,
    minHeight,
  });

  const animatedStyles = useAnimatedStyles({ height, pressed, bottom });

  return {
    drag,
    onContentLayout,
    animatedStyles,
  };
}
