import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { ViewStyle } from "react-native";
import {
  useSharedValue,
  SharedValue,
  withTiming,
  withRepeat,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  withDelay,
} from "react-native-reanimated";

interface ContextState {
  loopAnimation: SharedValue<number>;
  backgroundColorStyle: ViewStyle;
}

const Context = React.createContext<ContextState | undefined>(undefined);

const loopDuration = 1500;

// NOTE: Don't turn off the animation via flags here as multiple different features use this same
// animation. Call the flags in the components that use this animation instead.
// Loop the animation from 0-1 and then it hops back to 1
function useAnimations(animate = true): ContextState {
  const backgroundColor = useThemeColor("skeleton");
  const backgroundColorPulse = useThemeColor("skeletonPulse");
  const loopAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (animate) {
      loopAnimation.value = withRepeat(
        withDelay(
          500,
          withTiming(1, {
            duration: loopDuration,
            easing: Easing.bezier(0.77, 0.25, 1, 1),
          }),
        ),
        -1,
        false,
      );
    } else {
      loopAnimation.value = 0;
    }

    return () => {
      loopAnimation.value = 0;
    };
  }, [loopAnimation, animate]);

  const backgroundColorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      loopAnimation.value,
      [0, 0.5, 0.7, 1],
      [backgroundColor, backgroundColor, backgroundColorPulse, backgroundColor],
    ),
  }));

  return {
    loopAnimation,
    backgroundColorStyle,
  };
}

export const useSkeletonAnimation = (): ContextState | null => {
  const context = React.useContext(Context);

  return context || null;
};

export const SkeletonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loopAnimation, backgroundColorStyle } = useAnimations(true);

  const value = React.useMemo<ContextState>(
    () => ({ loopAnimation, backgroundColorStyle }),
    [loopAnimation, backgroundColorStyle],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
