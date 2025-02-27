import React from "react";
import { withSpring, SharedValue, DerivedValue } from "react-native-reanimated";
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

  const open = React.useCallback(() => {
    debugLog(`open - ${Math.round(maxAutoHeight.value)}`);

    height.value = withSpring(maxAutoHeight.value, autoAnimateConfig);
  }, [height, maxAutoHeight]);

  const close = React.useCallback(() => {
    debugLog(`close - ${Math.round(minHeight.value)}`);

    height.value = withSpring(minHeight.value, autoAnimateConfig);
  }, [height, minHeight]);

  React.useImperativeHandle(ref, () => ({
    open: open,
    close: () => {
      height.value = withSpring(minHeight.value, autoAnimateConfig);
    },
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
