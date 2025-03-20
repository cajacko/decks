import React from "react";
import useFlag from "@/hooks/useFlag";
import * as Haptics from "expo-haptics";

export default function useVibrate() {
  const canVibrate = useFlag("CARD_ACTIONS_HAPTICS") === "enabled";

  let lastVibrated = React.useRef<Date | null>(null);
  let vibrateTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const vibrate = React.useCallback(
    (
      debugKey: string,
      options?: {
        delay?: number;
        throttle?: number;
      },
    ) => {
      if (vibrateTimeout.current) {
        clearTimeout(vibrateTimeout.current);
        vibrateTimeout.current = null;
      }

      function run() {
        const now = new Date();

        if (
          options?.throttle &&
          lastVibrated.current &&
          now.getTime() - lastVibrated.current.getTime() < options.throttle
        ) {
          return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        lastVibrated.current = now;
      }

      if (options?.delay) {
        vibrateTimeout.current = setTimeout(run, options.delay);
      } else {
        run();
        vibrateTimeout.current = null;
      }
    },
    [],
  );

  const clearPendingVibrations = React.useCallback(() => {
    if (vibrateTimeout.current) {
      clearTimeout(vibrateTimeout.current);
      vibrateTimeout.current = null;
    }
  }, []);

  if (!canVibrate) return {};

  return {
    clearPendingVibrations,
    vibrate,
  };
}
