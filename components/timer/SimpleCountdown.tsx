import React from "react";
import Number from "@/components/timer/Number";
import { StyleSheet, View } from "react-native";
import {
  InternalTimerRef,
  TimerState,
  TimerProps,
} from "@/components/timer/Timer.types";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconSymbol from "@/components/ui/IconSymbol";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  withSpring,
} from "react-native-reanimated";
import TimerCircle from "@/components/timer/TimerCircle";

export type SimpleCountdownProps = TimerProps<{
  initSeconds?: number;
}>;

function useSimpleCountdown(
  { initSeconds = 60, onFinished }: SimpleCountdownProps,
  ref: React.ForwardedRef<InternalTimerRef>,
) {
  const [timerState, setTimerState] = React.useState<TimerState>("ready");
  const [seconds, setSeconds] = React.useState(initSeconds);
  const startProgress = useSharedValue(0);
  const endProgress = useSharedValue(0);
  const iconSize = useSharedValue(1);
  const numbersSize = useSharedValue(0);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null); // Ref to store the interval

  // useImperativeHandle doesn't update with new prop/ state changes so to access the latest we
  // need to grab from refs
  const _state = {
    initSeconds,
    timerState,
    seconds,
    onFinished,
  };
  const stateRef = React.useRef(_state);
  stateRef.current = _state;

  const resume = React.useCallback<InternalTimerRef["resume"]>(() => {
    if (intervalRef.current) return; // Prevent multiple intervals

    setTimerState("started");

    startProgress.value = 0;
    numbersSize.value = withSpring(1);
    iconSize.value = withTiming(0, {
      duration: 500,
    });

    endProgress.value = withTiming(1, {
      duration: stateRef.current.seconds * 1000,
      easing: Easing.linear,
    });

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }, [endProgress, startProgress, numbersSize, iconSize]);

  const isZeroSeconds = seconds === 0;

  React.useEffect(() => {
    if (!isZeroSeconds) return;

    setTimerState("finished");
    stateRef.current.onFinished?.();

    endProgress.value = withTiming(1, {
      duration: 200,
      easing: Easing.linear,
    });
  }, [isZeroSeconds, endProgress]);

  const pause = React.useCallback<InternalTimerRef["pause"]>(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    numbersSize.value = withSpring(0);
    iconSize.value = withSpring(1);
    cancelAnimation(endProgress);
    setTimerState("paused");
  }, [endProgress, numbersSize, iconSize]);

  const reset = React.useCallback<InternalTimerRef["reset"]>(
    ({ animateProgressAnimation = false } = {}) => {
      setSeconds(stateRef.current.initSeconds);

      numbersSize.value = withSpring(0);
      iconSize.value = withSpring(1);

      if (!animateProgressAnimation) {
        startProgress.value = 0;
        endProgress.value = 0;

        return;
      }

      startProgress.value = withTiming(
        1,
        {
          duration: 500,
          easing: Easing.linear,
        },
        () => {
          startProgress.value = 0;
          endProgress.value = 0;
        },
      );
    },
    [endProgress, startProgress, numbersSize, iconSize],
  );

  const getState = React.useCallback<InternalTimerRef["getState"]>(() => {
    return stateRef.current.timerState;
  }, []);

  React.useImperativeHandle(ref, () => ({
    reset,
    pause,
    resume,
    getState,
    setState: setTimerState,
  }));

  /**
   * Given the seconds this will return the digits in the correct order to display.
   */
  const numbers = React.useMemo((): number[] => {
    const digits = String(seconds).split("");

    return digits.map((digit) => parseInt(digit, 10));
  }, [seconds]);

  const pauseFlash = useSharedValue(0);
  const isPaused = timerState === "paused";

  React.useEffect(() => {
    if (isPaused) {
      pauseFlash.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
    } else {
      pauseFlash.value = 0;
    }
  }, [isPaused, pauseFlash]);

  return {
    numbers,
    timerState,
    pauseFlash,
    endProgress,
    startProgress,
    numbersSize,
    iconSize,
  };
}

export default React.forwardRef<InternalTimerRef, SimpleCountdownProps>(
  function SimpleCountdown(props, ref): React.ReactNode {
    const {
      numbers,
      pauseFlash,
      timerState,
      endProgress,
      startProgress,
      numbersSize,
      iconSize,
    } = useSimpleCountdown(props, ref);
    const primaryColor = useThemeColor("primary");
    const textColor = useThemeColor("text");

    const animatedPausedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        pauseFlash.value,
        [0, 0.2, 0.8, 1],
        [1, 1, 0.2, 0.2],
      ),
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(iconSize.value, [0, 1], [0, 1]),
        },
      ],
      marginTop: interpolate(iconSize.value, [0, 1], [-10, 12]),
    }));

    const animatedNumbersStyle = useAnimatedStyle(() => ({
      transform: [
        {
          scale: interpolate(numbersSize.value, [0, 1], [0.5, 1]),
        },
      ],
      marginTop: interpolate(iconSize.value, [0, 1], [-22, -5]),
    }));

    const { style, iconContainerStyle, numbersContainerStyle } = React.useMemo(
      () => ({
        style: [styles.container, animatedPausedStyle],
        iconContainerStyle: [styles.iconContainer, animatedIconStyle],
        numbersContainerStyle: [styles.numbersContainer, animatedNumbersStyle],
      }),
      [animatedPausedStyle, animatedIconStyle, animatedNumbersStyle],
    );

    return (
      <Animated.View style={style}>
        <View style={styles.content}>
          <Animated.View style={iconContainerStyle}>
            <IconSymbol
              name={timerState === "paused" ? "pause" : "timer"}
              color={primaryColor}
              size={30}
            />
          </Animated.View>
          <Animated.View style={numbersContainerStyle}>
            {numbers.map((number, i) => (
              <Number key={i} number={number} />
            ))}
          </Animated.View>
        </View>

        <TimerCircle
          size={size}
          strokeWidth={4}
          startProgress={startProgress}
          endProgress={endProgress}
          progressColor={textColor}
        />
      </Animated.View>
    );
  },
);

const size = 70;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: size / 2,
    position: "relative",
    height: size,
    width: size,
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 4,
  },
  numbersContainer: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // alignItems: "center",
    // justifyContent: "center",
    zIndex: 3,
    flexDirection: "row",
  },
  iconContainer: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    // alignItems: "center",
    // justifyContent: "center",
    zIndex: 2,
  },
  iconBackground: {
    position: "relative",
    height: 20,
    width: 20,
    zIndex: 1,
    opacity: 0.5,
  },
});
