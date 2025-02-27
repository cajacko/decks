import React from "react";
import {
  withSpring,
  SharedValue,
  DerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { BottomDrawerRef } from "./BottomDrawer.types";
import { autoAnimateConfig } from "./bottomDrawer.style";
import debugLog from "./debugLog";

/**
 * Set up useImperativeHandle handler for any controls that other components may need regarding the
 * bottom drawer e.g. open/ close
 */
export default function useOpenClose(
  props: {
    height: SharedValue<number>;
    maxAutoHeight: DerivedValue<number>;
    minHeight: SharedValue<number>;
    hasGotMaxHeight: boolean;
    openOnMount: boolean;
  },
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height, maxAutoHeight, minHeight, hasGotMaxHeight } = props;

  const open = React.useCallback((): Promise<void> => {
    debugLog(`open - ${Math.round(maxAutoHeight.value)}`);

    return new Promise((resolve) => {
      height.value = withSpring(maxAutoHeight.value, autoAnimateConfig, () => {
        runOnJS(resolve)();
      });
    });
  }, [height, maxAutoHeight]);

  const close = React.useCallback((): Promise<void> => {
    debugLog(`close - ${Math.round(minHeight.value)}`);

    return new Promise((resolve) => {
      height.value = withSpring(minHeight.value, autoAnimateConfig, () => {
        runOnJS(resolve)();
      });
    });
  }, [height, minHeight]);

  React.useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const checkOpenOnMount = React.useRef(true);

  React.useEffect(() => {
    if (!checkOpenOnMount.current) return;
    // We want to wait until we have a max height we can open to. We need this prop so we don't open
    // to the default max height before we've got the available content
    if (!hasGotMaxHeight) return;

    debugLog(`Check if should open on mount`);

    checkOpenOnMount.current = false;

    if (!props.openOnMount) return;

    const timeout = setTimeout(open, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [open, props.openOnMount, hasGotMaxHeight]);

  return { open, close };
}
