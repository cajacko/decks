import { Animated } from "react-native";
import { CardRef, AnimationUpdate, RequiredRefObject } from "./Card.types";

export function withAnimateOut(props: {
  animationUpdate: RequiredRefObject<AnimationUpdate>;
  opacity: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  height: RequiredRefObject<number>;
  width: RequiredRefObject<number>;
}): CardRef["animateOut"] {
  return async ({ animateOpacity = true, duration = 300, direction }) => {
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
        Animated.timing(props.translateX, {
          toValue: x,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(props.translateY, {
          toValue: y,
          duration,
          useNativeDriver: true,
        }),
      ]);

      if (animateOpacity) {
        const opacityAnimation = Animated.sequence([
          Animated.delay(duration / 2), // Wait for half of the movement duration
          Animated.timing(props.opacity, {
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

export function withAnimateFlip(props: {
  animationUpdate: RequiredRefObject<AnimationUpdate>;
  scaleX: Animated.Value;
  initialRotation: RequiredRefObject<number>;
  rotate: Animated.Value;
}): CardRef["animateFlip"] {
  return async () => {
    const animateKey = "flip";
    props.animationUpdate.current(animateKey, true);

    return new Promise<unknown>((resolve) => {
      Animated.sequence([
        Animated.timing(props.rotate, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(props.scaleX, {
          toValue: 0, // Shrink to zero width
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(props.scaleX, {
          toValue: 1, // Expand back to full width
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(props.rotate, {
          toValue: props.initialRotation.current,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(resolve);
    }).finally(() => props.animationUpdate.current(animateKey, false));
  };
}
