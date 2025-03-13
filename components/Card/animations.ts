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
