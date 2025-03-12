import { Animated } from "react-native";
import { CardRef, AnimationUpdate, RequiredRefObject } from "./Card.types";

export function withAnimateOut(props: {
  animationUpdate: RequiredRefObject<AnimationUpdate>;
  opacity: RequiredRefObject<Animated.Value>;
  translateX: RequiredRefObject<Animated.Value>;
  translateY: RequiredRefObject<Animated.Value>;
  height: RequiredRefObject<number>;
  width: RequiredRefObject<number>;
  canAnimate: boolean;
}): CardRef["animateOut"] {
  return async ({ animateOpacity = true, duration = 300, direction }) => {
    if (!props.canAnimate) {
      return;
    }

    const animateKey = "out";
    props.animationUpdate.current(animateKey, true);

    return new Promise<unknown>((resolve) => {
      let x = 0,
        y = 0;

      switch (direction) {
        case "top":
          y = -props.height.current;
          break;
        case "right":
          x = props.width.current;
          break;
        case "bottom":
          y = props.height.current;
          break;
        case "left":
          x = -props.width.current;
          break;
      }

      const movementAnimation = Animated.parallel([
        Animated.timing(props.translateX.current, {
          toValue: x,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(props.translateY.current, {
          toValue: y,
          duration,
          useNativeDriver: true,
        }),
      ]);

      if (animateOpacity) {
        const opacityAnimation = Animated.sequence([
          Animated.delay(duration / 2), // Wait for half of the movement duration
          Animated.timing(props.opacity.current, {
            toValue: 0,
            // We need to make sure this finishes fading before the movement finishes, it causes
            // weird flickering issues otherwise
            duration: duration / 3, // Fade out over the second half
            useNativeDriver: true,
          }),
        ]);

        Animated.parallel([movementAnimation, opacityAnimation]).start(resolve);
      } else {
        movementAnimation.start(resolve);
      }
    }).finally(() => props.animationUpdate.current(animateKey, false));
  };
}

export const flipScaleDuration = 200;
export const flipRotationDuration = Math.round(flipScaleDuration / 4);

export function withAnimateFlipOut(props: {
  animationUpdate: RequiredRefObject<AnimationUpdate>;
  scaleX: RequiredRefObject<Animated.Value>;
  initialRotation: RequiredRefObject<number>;
  rotate: RequiredRefObject<Animated.Value>;
  canAnimate: boolean;
}): CardRef["animateFlipOut"] {
  return async () => {
    if (!props.canAnimate) {
      return;
    }

    const animateKey = "flip";
    props.animationUpdate.current(animateKey, true);

    return new Promise<unknown>((resolve) => {
      Animated.sequence([
        Animated.timing(props.rotate.current, {
          toValue: 0,
          duration: flipRotationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(props.scaleX.current, {
          toValue: 0, // Shrink to zero width
          duration: flipScaleDuration,
          useNativeDriver: true,
        }),
      ]).start(resolve);
    }).finally(() => props.animationUpdate.current(animateKey, false));
  };
}

export function withAnimateFlipIn(props: {
  animationUpdate: RequiredRefObject<AnimationUpdate>;
  scaleX: RequiredRefObject<Animated.Value>;
  initialRotation: RequiredRefObject<number>;
  rotate: RequiredRefObject<Animated.Value>;
  canAnimate: boolean;
}): CardRef["animateFlipIn"] {
  return async () => {
    if (!props.canAnimate) {
      return;
    }

    const animateKey = "flipIn";
    props.animationUpdate.current(animateKey, true);

    props.rotate.current.setValue(0);
    props.scaleX.current.setValue(0);

    return new Promise<unknown>((resolve) => {
      Animated.sequence([
        Animated.timing(props.scaleX.current, {
          toValue: 1, // Expand back to full width
          duration: flipScaleDuration,
          useNativeDriver: true,
        }),
        Animated.timing(props.rotate.current, {
          toValue: props.initialRotation.current,
          duration: flipRotationDuration,
          useNativeDriver: true,
        }),
      ]).start(resolve);
    }).finally(() => props.animationUpdate.current(animateKey, false));
  };
}
