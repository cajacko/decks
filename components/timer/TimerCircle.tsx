import React from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TimerCircle({
  startProgress: startProgressProp,
  endProgress,
  size,
  strokeWidth,
  progressColor,
  trackColor = "transparent",
  style: styleProp,
}: {
  startProgress?: SharedValue<number>;
  endProgress: SharedValue<number>;
  size: number;
  strokeWidth: number;
  progressColor: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const startProgress = useDerivedValue(() =>
    startProgressProp ? startProgressProp.value : 0,
  );
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      circumference * (1 - endProgress.value - startProgress.value),
  }));

  const animatedStyle = useAnimatedStyle(() => {
    const is1 = endProgress.value === 0 && startProgress.value === 0;
    const is0 = startProgress.value === 1 && endProgress.value === 0;

    return {
      opacity: is1 || is0 ? 0 : 1,
    };
  });

  const style = React.useMemo(
    () => [
      StyleSheet.flatten([
        {
          transform: [{ rotateZ: "-90deg" }],
          height: size,
          width: size,
          borderRadius: size / 2,
        },
        styleProp,
      ]),
      animatedStyle,
    ],
    [size, styleProp, animatedStyle],
  );

  return (
    <Animated.View style={style}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>
    </Animated.View>
  );
}
