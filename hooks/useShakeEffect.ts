import React from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  DeviceMotion.setUpdateInterval(50); // fast updates for accurate gesture tracking
}

export default function useShakeEffect(callback?: (() => void) | null) {
  const rotationHistory = React.useRef<{
    left: number | null;
    right: number | null;
    lastTriggered: number | null;
  }>({
    left: null,
    right: null,
    lastTriggered: null,
  });

  React.useEffect(() => {
    if (!callback) return;

    const ROTATION_THRESHOLD = 350; // degrees per second
    const SHAKE_WINDOW_MS = 500;
    const COOLDOWN_MS = 1500;

    const handleMotion = ({ rotationRate }: DeviceMotionMeasurement) => {
      if (!rotationRate?.gamma) return;

      const now = Date.now();
      const z = rotationRate.gamma;

      if (Math.abs(z) < ROTATION_THRESHOLD) return;

      if (z > 0) {
        rotationHistory.current.right = now;
      } else {
        rotationHistory.current.left = now;
      }

      if (!rotationHistory.current.left || !rotationHistory.current.right) {
        return;
      }

      const timeBetweenDirections = Math.abs(
        rotationHistory.current.left - rotationHistory.current.right,
      );

      if (timeBetweenDirections > SHAKE_WINDOW_MS) {
        return;
      }

      if (
        rotationHistory.current.lastTriggered &&
        now - rotationHistory.current.lastTriggered < COOLDOWN_MS
      ) {
        return;
      }

      rotationHistory.current.lastTriggered = now;
      callback();
    };

    const subscription = DeviceMotion.addListener(handleMotion);

    return () => {
      subscription.remove();
    };
  }, [callback]);
}
