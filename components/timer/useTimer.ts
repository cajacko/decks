/* eslint-disable react-hooks/exhaustive-deps */
import {
  cancelAnimation,
  Easing,
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useVibrate from "@/hooks/useVibrate";
import React from "react";

export type TimerState = "ready" | "started" | "paused" | "finished";

interface UseTimerMethods {
  resume: () => void;
  pause: () => void;
  reset: () => void;
  getState: () => TimerState;
  toggle: () => void;
  stop: () => void;
  start: () => void;
}

export interface UseTimerProps {
  initSeconds: number;
  doNotPulse?: boolean;
  onFinished?: (reset: () => void) => void;
  onResume?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onStop?: () => void;
  onStart?: () => void;
  onToggle?: () => void;
  onChangeState?: (state: TimerState) => void;
}

export interface UseTimerReturn extends UseTimerMethods {
  countdown: SharedValue<number>;
  pulse: SharedValue<number>;
  percentageProgress: SharedValue<number>;
}

/**
 * The most basic time hook that every timer needs to be able to display with
 */
export default function useTimer({
  initSeconds: initSecondsProp,
  onFinished,
  onChangeState,
  onPause,
  onResume,
  onReset,
  onStart,
  onStop,
  onToggle,
  doNotPulse = false,
}: UseTimerProps): UseTimerReturn {
  const state = useSharedValue<TimerState>("ready");
  const initSeconds = useSharedValue(initSecondsProp);
  const countdown = useSharedValue(initSecondsProp);
  const seconds = useDerivedValue(() => Math.ceil(countdown.value));
  const { vibrate } = useVibrate();
  const pulseAnimation = useSharedValue(0);

  const pulseInterval = React.useRef<NodeJS.Timeout | null>(null);

  const pulse = React.useCallback(
    (loop?: boolean) => {
      if (doNotPulse) return;

      function run() {
        vibrate?.("useTimer = on second");

        const duration = 150;

        pulseAnimation.value = withTiming(
          1,
          { duration, easing: Easing.linear },
          () => {
            pulseAnimation.value = withTiming(0, {
              duration,
              easing: Easing.linear,
            });
          },
        );
      }

      run();

      if (loop) {
        if (pulseInterval.current) {
          clearTimeout(pulseInterval.current);

          pulseInterval.current = null;
        }

        pulseInterval.current = setInterval(() => {
          run();
        }, 1000);
      }
    },
    [doNotPulse, vibrate],
  );

  const onSecond = React.useCallback(
    (second: number) => {
      if (second <= 0) return;
      if (second > 3) return;

      pulse();
    },
    [doNotPulse],
  );

  useDerivedValue(() => {
    runOnJS(onSecond)(seconds.value);
  });

  const percentageProgress = useDerivedValue(
    () => 1 - countdown.value / initSeconds.value,
  );

  function reset() {
    state.value = "ready";
    initSeconds.value = initSecondsProp;
    countdown.value = initSecondsProp;

    if (pulseInterval.current) {
      clearTimeout(pulseInterval.current);
      pulseInterval.current = null;
    }

    onChangeState?.("ready");
    onReset?.();
  }

  function pause() {
    state.value = "paused";

    cancelAnimation(countdown);

    onChangeState?.("paused");
    onPause?.();
  }

  function getState() {
    return state.value;
  }

  function resume() {
    state.value = "started";

    countdown.value = withTiming(
      0,
      {
        duration: countdown.value * 1000,
        easing: Easing.linear,
      },
      (finished) => {
        if (!finished) return;

        state.value = "finished";

        runOnJS(pulse)(true);

        if (onChangeState) {
          runOnJS(onChangeState)("finished");
        }

        if (onFinished) {
          runOnJS(onFinished)(reset);
        }
      },
    );

    onChangeState?.("started");
    onResume?.();
  }

  function start() {
    pause();
    reset();
    resume();
    onStart?.();
  }

  function stop() {
    pause();
    reset();
    onStop?.();
  }

  function toggle() {
    switch (getState()) {
      case "started":
        pause();
        break;
      case "paused":
        resume();
        break;
      case "finished":
        start();
        break;
      case "ready":
        start();
        break;
    }

    onToggle?.();
  }

  return {
    countdown,
    percentageProgress,
    resume,
    pause,
    reset,
    getState,
    toggle,
    stop,
    start,
    pulse: pulseAnimation,
  };
}
