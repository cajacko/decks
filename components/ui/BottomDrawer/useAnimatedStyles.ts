import {
  useAnimatedStyle,
  SharedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useThemeColors } from "@/hooks/useThemeColor";

export function useAnimatedHeightStyle(height: SharedValue<number>) {
  return useAnimatedStyle(() => {
    return {
      height: height.value,
      // Needed for web
      maxHeight: height.value,
    };
  });
}

export default function useAnimatedStyles(props: {
  height: SharedValue<number>;
  pressed: SharedValue<boolean>;
  bottom: SharedValue<number>;
}) {
  const { drawerDragBarActive, drawerDragBarPassive } = useThemeColors();
  const { height, pressed } = props;

  const sharedStyles = useSharedValue({
    dragBarBackgroundColorPressed: drawerDragBarActive,
    dragBarBackgroundColorDefault: drawerDragBarPassive,
  });

  const heightStyle = useAnimatedHeightStyle(height);

  const bottomStyle = useAnimatedStyle(() => {
    return {
      bottom: props.bottom ? props.bottom.value : 0,
    };
  });

  const dragBarColor = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value
        ? sharedStyles.value.dragBarBackgroundColorPressed
        : sharedStyles.value.dragBarBackgroundColorDefault,
    };
  });

  return {
    bottomStyle,
    height: heightStyle,
    dragBarColor,
  };
}
