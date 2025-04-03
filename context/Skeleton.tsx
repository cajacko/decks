import useFlag from "@/hooks/useFlag";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  useSharedValue,
  SharedValue,
  withTiming,
  withRepeat,
  Easing,
  useDerivedValue,
  interpolateColor,
} from "react-native-reanimated";

interface ContextState {
  loopAnimation: SharedValue<number>;
  backAndForthAnimation: SharedValue<number>;
  color: SharedValue<string>;
  colorInverse: SharedValue<string>;
}

const Context = React.createContext<ContextState | undefined>(undefined);

const loopDuration = 2000;

// Loop the animation from 0-1 and then it hops back to 1
function useAnimations(_animate = true): ContextState {
  const animate = useFlag("SKELETON_ANIMATIONS") === "enabled" && _animate;

  const backgroundColor = useThemeColor("skeleton");
  const backgroundColorPulse = useThemeColor("skeletonPulse");
  const loopAnimation = useSharedValue(0);
  const backAndForthAnimation = useSharedValue(0);

  React.useEffect(() => {
    if (animate) {
      backAndForthAnimation.value = withRepeat(
        withTiming(1, { duration: loopDuration / 2 }),
        -1,
        true,
      );
    } else {
      backAndForthAnimation.value = 0;
    }

    return () => {
      backAndForthAnimation.value = 0;
    };
  }, [backAndForthAnimation, animate]);

  React.useEffect(() => {
    if (animate) {
      loopAnimation.value = withRepeat(
        withTiming(1, { duration: loopDuration, easing: Easing.linear }),
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

  const color = useDerivedValue(() => {
    return interpolateColor(
      backAndForthAnimation.value,
      [0, 1],
      [backgroundColor, backgroundColorPulse],
    );
  });

  const colorInverse = useDerivedValue(() => {
    return interpolateColor(
      backAndForthAnimation.value,
      [1, 0],
      [backgroundColor, backgroundColorPulse],
    );
  });

  return {
    loopAnimation,
    backAndForthAnimation,
    color,
    colorInverse,
  };
}

export const useSkeletonAnimation = (): ContextState => {
  const context = React.useContext(Context);

  const backupAnimations = useAnimations(!!context);

  return context ?? backupAnimations;
};

export const SkeletonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { backAndForthAnimation, loopAnimation, color, colorInverse } =
    useAnimations();

  const value = React.useMemo<ContextState>(
    () => ({ loopAnimation, backAndForthAnimation, color, colorInverse }),
    [loopAnimation, backAndForthAnimation, color, colorInverse],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
