import React from "react";
import {
  TouchableScale,
  TouchableScaleProps,
} from "@/components/ui/Pressables";
import SimpleCountdown from "@/components/timer/SimpleCountdown";
import {
  TimerRef,
  InternalTimerRef,
  TimerProps as _TimerProps,
} from "@/components/timer/Timer.types";
import useVibrate from "@/hooks/useVibrate";

export function useAlertVibration() {
  const { vibrate } = useVibrate();

  const vibrateAlert = React.useCallback(() => {
    vibrate?.("Timer", { impactStyle: "heavy" });

    setTimeout(() => {
      vibrate?.("Timer", { impactStyle: "heavy" });
    }, 1000);

    setTimeout(() => {
      vibrate?.("Timer", { impactStyle: "heavy" });
    }, 2000);
  }, [vibrate]);

  return {
    vibrateAlert,
  };
}

export interface TimerProps
  extends Pick<TouchableScaleProps, "style" | "contentContainerStyle">,
    _TimerProps {}

export default React.forwardRef<TimerRef, TimerProps>(function Timer(
  { contentContainerStyle, style, onFinished: _onFinished, ...props },
  timerRef,
) {
  const { vibrateAlert } = useAlertVibration();
  const internalTimerRef = React.useRef<InternalTimerRef>(null);

  const onFinishedTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const start = React.useCallback<TimerRef["start"]>(() => {
    if (onFinishedTimeout.current) clearTimeout(onFinishedTimeout.current);

    internalTimerRef.current?.reset({ animateProgressAnimation: false });
    internalTimerRef.current?.resume();
  }, []);

  const stop = React.useCallback<TimerRef["stop"]>(() => {
    if (onFinishedTimeout.current) clearTimeout(onFinishedTimeout.current);

    internalTimerRef.current?.pause();
    internalTimerRef.current?.reset({ animateProgressAnimation: false });
    internalTimerRef.current?.setState("ready");
  }, []);

  const toggle = React.useCallback<TimerRef["toggle"]>(() => {
    if (onFinishedTimeout.current) clearTimeout(onFinishedTimeout.current);

    switch (internalTimerRef.current?.getState()) {
      case "started":
        internalTimerRef.current?.pause();
        break;
      case "paused":
        internalTimerRef.current?.resume();
        break;
      case "finished":
        start();
        break;
      case "ready":
        start();
        break;
    }

    return internalTimerRef.current?.getState() ?? "ready";
  }, [start]);

  React.useImperativeHandle(timerRef, () => ({
    reset: () => internalTimerRef.current?.reset(),
    pause: () => internalTimerRef.current?.pause(),
    resume: () => internalTimerRef.current?.resume(),
    getState: () => internalTimerRef.current?.getState() ?? "ready",
    setState: (state) => internalTimerRef.current?.setState(state),
    stop,
    start,
    toggle,
  }));

  const onFinished = React.useCallback(() => {
    vibrateAlert();
    _onFinished?.();

    onFinishedTimeout.current = setTimeout(() => {
      internalTimerRef.current?.reset({ animateProgressAnimation: true });
    }, 5000);
  }, [vibrateAlert, _onFinished]);

  return (
    <TouchableScale
      onPress={toggle}
      onLongPress={stop}
      style={style}
      vibrate
      contentContainerStyle={contentContainerStyle}
    >
      <SimpleCountdown
        ref={internalTimerRef}
        onFinished={onFinished}
        {...props}
      />
    </TouchableScale>
  );
});
