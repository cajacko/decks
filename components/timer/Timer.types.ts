export type TimerState = "started" | "paused" | "finished" | "ready";

export type TimerProps<P extends object = {}> = P & {
  onFinished?: () => void;
  initSeconds?: number;
};

/**
 * We can do everything given these methods
 */
export interface InternalTimerRef {
  /**
   * Just sets the seconds to the init value, does not affect the countdown
   */
  reset: (options?: { animateProgressAnimation?: boolean }) => void;
  pause: () => void;
  resume: () => void;
  getState: () => TimerState;
  setState: (state: TimerState) => void;
}

export interface TimerRef extends InternalTimerRef {
  /**
   * Starts the countdown from the init value
   */
  start: () => void;
  /**
   * Stops the countdown and resets it to the init value
   */
  stop: () => void;
  /**
   * Depending on the current state it will transition to:
   *
   * - started -> paused
   * - paused -> started
   * - finished -> started
   * - ready -> started
   */
  toggle: () => TimerState;
}
