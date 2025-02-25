import { useSharedValue } from "react-native-reanimated";
import { defaultProps } from "./BottomDrawer.types";
import { useAnimatedHeightStyle } from "./useAnimatedStyles";

/**
 * Helper to manage access the height of the bottom drawer from the parent component, the
 * sharedValue from here should be passed into the `BottomDrawer` component.
 */
export default function useHeight(startingHeight?: number) {
  const sharedValue = useSharedValue(startingHeight ?? defaultProps.minHeight);

  return {
    sharedValue,
    heightStyle: useAnimatedHeightStyle(sharedValue),
  };
}
