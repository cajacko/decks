import React from "react";
import { CardProps, CardRef } from "./Card.types";
import { getOffsetPosition } from "@/components/Stack/stackOffsetPositions";
import { useCardSizes } from "./CardSize.context";
import useFlag from "@/hooks/useFlag";
import {
  runOnJS,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import useOffsetPositions from "./useOffsetPositions";

export const flipScaleDuration = 200;
export const flipRotationDuration = Math.round(flipScaleDuration / 4);

export default function useCard(
  props: Pick<
    CardProps,
    | "onAnimationChange"
    | "offsetPosition"
    | "initialRotation"
    | "initialScaleX"
    | "constraints"
    | "proportions"
  >,
  ref: React.ForwardedRef<CardRef>,
) {
  const canAnimate = useFlag("CARD_ANIMATIONS") === "enabled";
  const cardSizes = useCardSizes(props);
  const height = cardSizes.dpHeight;
  const width = cardSizes.dpWidth;
  const offsetPositions = useOffsetPositions(props);

  const offsetPosition = React.useMemo(
    () =>
      offsetPositions &&
      getOffsetPosition(offsetPositions, props.offsetPosition),
    [offsetPositions, props.offsetPosition],
  );

  const isAnimatingRef = React.useRef<Record<string, boolean | undefined>>({});
  const translateX = useSharedValue<number | null>(offsetPosition?.x ?? null);
  const translateY = useSharedValue<number | null>(offsetPosition?.y ?? null);
  const opacity = useSharedValue<number | null>(null);
  const rotate = useSharedValue<number | null>(
    props.initialRotation ?? offsetPosition?.rotate ?? null,
  );
  const scaleX = useSharedValue<number | null>(props.initialScaleX ?? null);

  function getIsAnimating() {
    return Object.values(isAnimatingRef.current).some(
      (isAnimating) => isAnimating,
    );
  }

  function animationUpdate(key: string, isAnimating: boolean) {
    const prevIsAnimating = getIsAnimating();

    isAnimatingRef.current[key] = isAnimating;

    const nextIsAnimating = getIsAnimating();

    if (prevIsAnimating === nextIsAnimating) return;

    props.onAnimationChange?.(nextIsAnimating);
  }

  // These are needed to pass the latest values to useImperativeHandle, as that only initialises the
  // once and doesn't update when the values change. With refs we can capture them
  const animationUpdateRef = React.useRef(animationUpdate);
  const heightRef = React.useRef(height);
  const widthRef = React.useRef(width);
  const initialRotation = useSharedValue<number | null>(
    offsetPosition?.rotate ?? null,
  );

  animationUpdateRef.current = animationUpdate;
  heightRef.current = height;
  widthRef.current = width;

  React.useEffect(() => {
    initialRotation.value = offsetPosition?.rotate ?? null;
  }, [initialRotation, offsetPosition?.rotate]);

  const animateFlipOut = React.useCallback<CardRef["animateFlipOut"]>(() => {
    const animateKey = "flip";

    animationUpdateRef.current(animateKey, true);

    rotate.value = initialRotation.value ?? 0;
    scaleX.value = 1;

    return new Promise((resolve) => {
      if (!canAnimate) {
        return resolve(undefined);
      }

      rotate.value = withTiming(0, { duration: flipRotationDuration }, () => {
        scaleX.value = withTiming(0, { duration: flipScaleDuration }, () => {
          runOnJS(resolve)(undefined);
        });
      });
    }).finally(() => animationUpdateRef.current(animateKey, false));
  }, [canAnimate, rotate, scaleX, initialRotation]);

  const animateFlipIn = React.useCallback<CardRef["animateFlipIn"]>(() => {
    const animateKey = "flipIn";

    animationUpdateRef.current(animateKey, true);

    rotate.value = 0;
    scaleX.value = 0;

    return new Promise((resolve) => {
      if (!canAnimate) {
        return resolve(undefined);
      }

      scaleX.value = withTiming(1, { duration: flipScaleDuration }, () => {
        rotate.value = withTiming(
          initialRotation.value ?? 0,
          { duration: flipRotationDuration },
          () => {
            runOnJS(resolve)(undefined);
          },
        );
      });
    }).finally(() => {
      animationUpdateRef.current(animateKey, false);
      scaleX.value = null;
      rotate.value = initialRotation.value ?? null;
    });
  }, [canAnimate, scaleX, rotate, initialRotation]);

  const animateOut = React.useCallback<CardRef["animateOut"]>(
    async ({ animateOpacity = true, duration = 300, direction }) => {
      if (!canAnimate) {
        return;
      }

      const animateKey = "out";
      animationUpdateRef.current(animateKey, true);

      translateX.value = translateX.value ?? 0;
      translateY.value = translateY.value ?? 0;

      return new Promise<unknown>((resolve) => {
        let x = 0;
        let y = 0;

        switch (direction) {
          case "top":
            y = -heightRef.current;
            break;
          case "right":
            x = widthRef.current;
            break;
          case "bottom":
            y = heightRef.current;
            break;
          case "left":
            x = -widthRef.current;
            break;
        }

        const waitingFor: ("translateX" | "translateY" | "animateOpacity")[] = [
          "translateX",
          "translateY",
        ];

        function resolveIfReady(key: (typeof waitingFor)[number]) {
          waitingFor.splice(waitingFor.indexOf(key), 1);

          if (waitingFor.length === 0) {
            resolve(undefined);
          }
        }

        const easing = Easing.ease;

        translateX.value = withTiming(x, { duration, easing }, () => {
          runOnJS(resolveIfReady)("translateX");
        });

        translateY.value = withTiming(y, { duration, easing }, () => {
          runOnJS(resolveIfReady)("translateY");
        });

        if (animateOpacity) {
          waitingFor.push("animateOpacity");

          opacity.value = 1;

          opacity.value = withDelay(
            (duration / 3) * 2,
            withTiming(
              0,
              { duration: duration / 3, easing: Easing.ease },
              () => {
                runOnJS(resolveIfReady)("animateOpacity");
              },
            ),
          );
        } else {
        }
      }).finally(() => animationUpdateRef.current(animateKey, false));
    },
    [canAnimate, translateX, translateY, opacity],
  );

  React.useImperativeHandle(ref, () => ({
    getIsAnimating,
    animateFlipOut,
    animateFlipIn,
    animateOut,
  }));

  return {
    opacity,
    translateX,
    translateY,
    scaleX,
    rotate,
    cardSizes,
  };
}
