import React from "react";
import {
  withSpring,
  SharedValue,
  runOnJS,
  useSharedValue,
} from "react-native-reanimated";
import { BottomDrawerRef } from "./BottomDrawer.types";
import { autoAnimateConfig, dragHeight } from "./bottomDrawer.style";
import debugLog from "./debugLog";

/**
 * Set up useImperativeHandle handler for any controls that other components may need regarding the
 * bottom drawer e.g. open/ close
 */
export default function useOpenClose(
  props: {
    height: SharedValue<number>;
    maxAutoHeight: number;
    minHeight: number;
    hasGotMaxHeight: boolean;
    openOnMount: boolean;
    animateIn: boolean;
    initHeight: number;
  },
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height, maxAutoHeight, minHeight, hasGotMaxHeight } = props;

  const open = React.useCallback((): Promise<void> => {
    debugLog(`set height.value:${Math.round(maxAutoHeight)} (open)`);

    return new Promise((resolve) => {
      height.value = withSpring(maxAutoHeight, autoAnimateConfig, () => {
        runOnJS(resolve)();
      });
    });
  }, [height, maxAutoHeight]);

  const close = React.useCallback((): Promise<void> => {
    debugLog(`set height.value:${Math.round(minHeight)} (close)`);

    return new Promise((resolve) => {
      height.value = withSpring(minHeight, autoAnimateConfig, () => {
        runOnJS(resolve)();
      });
    });
  }, [height, minHeight]);

  React.useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const haveCheckedInitAnimations = React.useRef(false);
  const bottom = useSharedValue(
    props.animateIn ? -props.initHeight - dragHeight : 0,
  );

  // Animate open if necessary. Will sync the bottom and open animations if both exist
  React.useEffect(() => {
    if (haveCheckedInitAnimations.current) return;

    const animateBottom = () => {
      const bottomValue = 0;

      debugLog(`set bottom.value: ${bottomValue} (animateIn)`);

      bottom.value = withSpring(bottomValue, autoAnimateConfig);
    };

    if (!props.openOnMount) {
      haveCheckedInitAnimations.current = true;

      if (!props.animateIn) return;

      return animateBottom();
    }

    // We want to wait until we have a max height we can open to. We need this prop so we don't open
    // to the default max height before we've got the available content
    if (!hasGotMaxHeight) return;

    haveCheckedInitAnimations.current = true;

    if (props.animateIn) {
      animateBottom();
    }

    debugLog(`call open (openOnMount)`);
    open();
  }, [open, props.openOnMount, hasGotMaxHeight, props.animateIn, bottom]);

  return { open, close, bottom };
}
