import React from "react";
import { DeviceMotion, DeviceMotionMeasurement } from "expo-sensors";
import { Platform } from "react-native";

if (Platform.OS !== "web") {
  DeviceMotion.setUpdateInterval(50); // fast updates for accurate gesture tracking
}

const ROTATION_THRESHOLD_GAMMA = 350; // degrees per second
const ROTATION_THRESHOLD_ALPHA = 350; // degrees per second
const ROTATION_THRESHOLD_BETA = 350; // degrees per second
const SHAKE_WINDOW_MS = 500;
const COOLDOWN_MS = 1500;

// For each of these assume the phone is vertical facing you
// gamma - rotation around a click face
// alpha - backwards and forwards, so moving from facing you to facing the ceiling
// beta - Twisting about the middle. So the face is rotating away from you e.g. turning your head
// side to side

export default function useShakeEffect(callback?: (() => void) | null) {
  const rotationHistory = React.useRef<{
    lastTriggered: number | null;
    gamma: {
      positive: number | null;
      negative: number | null;
    };
    alpha: {
      positive: number | null;
      negative: number | null;
    };
    beta: {
      positive: number | null;
      negative: number | null;
    };
  }>({
    lastTriggered: null,
    gamma: {
      positive: null,
      negative: null,
    },
    alpha: {
      positive: null,
      negative: null,
    },
    beta: {
      positive: null,
      negative: null,
    },
  });

  React.useEffect(() => {
    if (Platform.OS === "web") return;
    if (!callback) return;

    function getHasDimensionBeenShaken(
      dimension: "gamma" | "alpha" | "beta",
      { rotationRate }: DeviceMotionMeasurement,
      options: {
        threshold: number;
        now: number;
      },
    ): boolean {
      const rate = rotationRate?.[dimension];

      // No data or movment
      if (!rate) return false;

      // Not a fast enough rotation rate to count
      if (Math.abs(rate) < options.threshold) return false;

      // Update the sides. We track both the negative and positive values separately, as we're
      // looking for a sudden change, not just a fast rotation in one direction
      if (rate > 0) {
        rotationHistory.current[dimension].positive = options.now;
      } else {
        rotationHistory.current[dimension].negative = options.now;
      }

      const positive = rotationHistory.current[dimension].positive;
      const negative = rotationHistory.current[dimension].negative;

      // We only have one side of the rotation so it can't be a shake
      if (!positive || !negative) {
        return false;
      }

      const timeBetweenDirections = Math.abs(positive - negative);

      // Too long between a fast enough shake in each direction
      if (timeBetweenDirections > SHAKE_WINDOW_MS) {
        return false;
      }

      // We have shaked in this direction
      return true;
    }

    const handleMotion = (measurement: DeviceMotionMeasurement) => {
      const now = Date.now();

      const gammaShake = getHasDimensionBeenShaken("gamma", measurement, {
        threshold: ROTATION_THRESHOLD_GAMMA,
        now,
      });

      const alphaShake = getHasDimensionBeenShaken("alpha", measurement, {
        threshold: ROTATION_THRESHOLD_ALPHA,
        now,
      });

      const betaShake = getHasDimensionBeenShaken("beta", measurement, {
        threshold: ROTATION_THRESHOLD_BETA,
        now,
      });

      // No shake between any of the three dimensions
      if (!gammaShake && !alphaShake && !betaShake) {
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
