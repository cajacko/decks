import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconSymbol from "@/components/ui/IconSymbol";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import TimerCircle from "@/components/timer/TimerCircle";
import { TouchableScale } from "@/components/ui/Pressables";
import useTimer, { UseTimerProps } from "@/components/timer/useTimer";
import useAlertVibration from "@/components/timer/useAlertVibration";
import Numbers from "@/components/timer/Numbers";

export type SimpleCountdownProps = UseTimerProps;

function useSimpleCountdown(props: SimpleCountdownProps) {
  const { vibrateAlert } = useAlertVibration();
  const startProgress = useSharedValue(0);
  const iconSize = useSharedValue(1);
  const numbersSize = useSharedValue(0);
  const pauseFlash = useSharedValue(0);

  const resetTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const { countdown, percentageProgress, toggle, stop, pulse } = useTimer({
    ...props,
    onResume: () => {
      startProgress.value = 0;
      numbersSize.value = withSpring(1);
      iconSize.value = withTiming(0, {
        duration: 500,
      });
    },
    onPause: () => {
      numbersSize.value = withSpring(0);
      iconSize.value = withSpring(1);
    },
    onChangeState: (state) => {
      if (state === "paused") {
        pauseFlash.value = withRepeat(
          withTiming(1, { duration: 500 }),
          -1,
          true,
        );
      } else {
        pauseFlash.value = 0;
      }
    },
    onFinished: (reset) => {
      vibrateAlert();

      resetTimeout.current = setTimeout(() => {
        reset();
      }, 3000);
    },
    onReset: () => {
      numbersSize.value = withSpring(0);
      iconSize.value = withSpring(1);
    },
  });

  return {
    pulse,
    countdown,
    pauseFlash,
    endProgress: percentageProgress,
    startProgress,
    numbersSize,
    iconSize,
    stop,
    toggle,
  };
}

export default React.memo<SimpleCountdownProps>(
  function SimpleCountdown(props): React.ReactNode {
    const {
      pauseFlash,
      countdown,
      endProgress,
      startProgress,
      numbersSize,
      iconSize,
      stop,
      toggle,
      pulse,
    } = useSimpleCountdown(props);

    const primaryColor = useThemeColor("primary");
    const textColor = useThemeColor("text");

    const animatedPausedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        pauseFlash.value,
        [0, 0.2, 0.8, 1],
        [1, 1, 0.2, 0.2],
      ),
      transform: [
        {
          scale: interpolate(pulse.value, [0, 1], [1, 1.1]),
        },
      ],
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
      <TouchableScale onPress={toggle} onLongPress={stop} vibrate>
        <Animated.View style={style}>
          <View style={styles.content}>
            <Animated.View style={iconContainerStyle}>
              <IconSymbol name="timer" color={primaryColor} size={30} />
            </Animated.View>
            <Animated.View style={numbersContainerStyle}>
              <Numbers initSeconds={props.initSeconds} countdown={countdown} />
            </Animated.View>
          </View>

          <TimerCircle
            countdown={countdown}
            size={size}
            strokeWidth={4}
            startProgress={startProgress}
            endProgress={endProgress}
            progressColor={textColor}
          />
        </Animated.View>
      </TouchableScale>
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
    // overflow: "hidden",
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
