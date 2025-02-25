import React from "react";
import { withSpring, SharedValue, DerivedValue } from "react-native-reanimated";
import { BottomDrawerRef } from "./BottomDrawer.types";
import { autoAnimateConfig } from "./bottomDrawer.style";

/**
 * Set up useImperativeHandle handler for any controls that other components may need regarding the
 * bottom drawer e.g. open/ close
 */
export default function useSetupRef(
  props: {
    height: SharedValue<number>;
    maxAutoHeight: DerivedValue<number>;
    minHeight: SharedValue<number>;
  },
  ref: React.Ref<BottomDrawerRef>,
) {
  const { height, maxAutoHeight, minHeight } = props;

  React.useImperativeHandle(ref, () => ({
    open: () => {
      height.value = withSpring(maxAutoHeight.value, autoAnimateConfig);
    },
    close: () => {
      height.value = withSpring(minHeight.value, autoAnimateConfig);
    },
  }));
}
