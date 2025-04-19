import React from "react";
import ThemedView from "@/components/ui/ThemedView";
import { TouchableScale } from "@/components/ui/Pressables";
import SimpleCountdown from "@/components/timer/SimpleCountdown";
import { TimerRef, InternalTimerRef } from "@/components/timer/Timer.types";

export interface TimerProps {
  children?: React.ReactNode;
}

export default React.forwardRef<TimerRef, TimerProps>(
  function Timer(props, timerRef) {
    const internalTimerRef = React.useRef<InternalTimerRef>(null);

    const start = React.useCallback<TimerRef["start"]>(() => {
      internalTimerRef.current?.reset();
      internalTimerRef.current?.resume();
    }, []);

    const stop = React.useCallback<TimerRef["stop"]>(() => {
      internalTimerRef.current?.pause();
      internalTimerRef.current?.reset();
      internalTimerRef.current?.setState("ready");
    }, []);

    const toggle = React.useCallback<TimerRef["toggle"]>(() => {
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

    return (
      <TouchableScale onPress={toggle} onLongPress={stop}>
        <ThemedView>
          <SimpleCountdown ref={internalTimerRef} />
        </ThemedView>
      </TouchableScale>
    );
  },
);
