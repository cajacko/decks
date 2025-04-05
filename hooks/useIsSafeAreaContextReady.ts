import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * We're seeing a lot of jumping around on launch with different insets. This waits to stabalise it
 */
export default function useIsSafeAreaContextReady(options: {
  timeoutWithoutChange: number;
  timeout: number;
}): boolean {
  const values = useSafeAreaInsets();
  // Timeout here so we don't trigger a re-render on every change
  const timeout = React.useRef(options.timeout);
  const timeoutWithoutChange = React.useRef(options.timeoutWithoutChange);
  const lastUpdated = React.useRef<Date>(new Date());
  const [isReady, setIsReady] = React.useState(false);

  // The main timeout
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, timeout.current);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Waits for the timeoutWithoutChange to be reached before setting isReady to true
  React.useEffect(() => {
    const now = new Date();
    const timeSinceLastChange =
      new Date().getTime() - lastUpdated.current.getTime();

    lastUpdated.current = now;

    if (timeSinceLastChange < timeoutWithoutChange.current) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, timeoutWithoutChange.current);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsReady(true);
    }
  }, [values]);

  return isReady;
}
