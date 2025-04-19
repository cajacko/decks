import React from "react";
import Number from "@/components/timer/Number";
import { StyleSheet, View } from "react-native";
import { InternalTimerRef, TimerState } from "@/components/timer/Timer.types";

export interface SimpleCountdownProps {
  initSeconds?: number;
}

function useSimpleCountdown(
  { initSeconds = 60 }: SimpleCountdownProps,
  ref: React.ForwardedRef<InternalTimerRef>,
) {
  const [timerState, setTimerState] = React.useState<TimerState>("ready");
  const [seconds, setSeconds] = React.useState(initSeconds);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null); // Ref to store the interval

  // useImperativeHandle doesn't update with new prop/ state changes so to access the latest we
  // need to grab from refs
  const _state = {
    initSeconds,
    timerState,
    seconds,
  };
  const stateRef = React.useRef(_state);
  stateRef.current = _state;

  // Calculate the number of digits needed to display the countdown. We always want to show the
  // same number of digits from the start to the end.
  const digitsToDisplay = React.useMemo(() => {
    const digits = Math.floor(Math.log10(initSeconds));

    return digits + 1;
  }, [initSeconds]);

  const resume = React.useCallback(() => {
    if (intervalRef.current) return; // Prevent multiple intervals

    setTimerState("started");

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTimerState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pause = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setTimerState("paused");
    }
  }, []);

  const reset = React.useCallback(() => {
    setSeconds(stateRef.current.initSeconds);
  }, []);

  const getState = React.useCallback((): TimerState => {
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
    const digits = String(seconds).padStart(digitsToDisplay, "0").split("");

    return digits.map((digit) => parseInt(digit, 10));
  }, [seconds, digitsToDisplay]);

  return { numbers };
}

export default React.forwardRef<InternalTimerRef, SimpleCountdownProps>(
  function SimpleCountdown(props, ref): React.ReactNode {
    const { numbers } = useSimpleCountdown(props, ref);

    return (
      <View style={styles.container}>
        {numbers.map((number, i) => (
          <Number key={i} number={number} />
        ))}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
