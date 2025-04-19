import React from "react";
import useVibrate from "@/hooks/useVibrate";

export default function useAlertVibration() {
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
