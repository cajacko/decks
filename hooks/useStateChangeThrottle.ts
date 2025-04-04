import React from "react";

export interface Options<T> {
  maxUpdateInterval?: number;
  /**
   * An additional delay before applying a value. Examples here are when we transition back to a
   * skeleton loader when a screen becomes unfocussed but you want to still show the items as the
   * screen animates out.
   */
  getDelay?: (prevValue: T, nextValue: T) => number;
}

/**
 * Returns the value but never updates more frequently than the specified maxUpdateInterval. Useful
 * for skeleton loaders or other loading situations where you want to avoid flickering.
 */
export default function useStateChangeThrottle<T>(
  value: T,
  options: Options<T>,
): T {
  const optionsRef = React.useRef<Options<T>>(options);
  optionsRef.current = options;

  const [delayedValue, setDelayedValue] = React.useState(value);
  const delayedValueRef = React.useRef<T>(delayedValue);
  delayedValueRef.current = delayedValue;

  const lastUpdated = React.useRef<number>(Date.now());
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    const maxUpdateInterval = optionsRef.current.maxUpdateInterval;
    const getDelay = optionsRef.current.getDelay;

    const manualDelay = getDelay?.(delayedValueRef.current, value);

    let currentUpdateInterval: number;

    if (manualDelay && maxUpdateInterval) {
      currentUpdateInterval = Math.max(manualDelay, maxUpdateInterval);
    } else if (maxUpdateInterval) {
      currentUpdateInterval = maxUpdateInterval;
    } else if (manualDelay) {
      currentUpdateInterval = manualDelay;
    } else {
      currentUpdateInterval = 0;
    }

    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    if (timeSinceLastUpdate > currentUpdateInterval) {
      setDelayedValue(value);
      lastUpdated.current = now;

      return;
    }

    const remainingTime = currentUpdateInterval - timeSinceLastUpdate;

    timeout.current = setTimeout(() => {
      setDelayedValue(value);
      lastUpdated.current = now;
    }, remainingTime);
  }, [value]);

  return delayedValue;
}
