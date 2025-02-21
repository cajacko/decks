import React from "react";
import { Animated } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export default function useCard(
  props: Pick<CardProps, "onAnimationChange">,
  ref: React.ForwardedRef<CardRef>,
) {
  const { onAnimationChange } = props;

  const { cardHeight: height, cardWidth: width } = useTabletopContext();
  // FIXME: We don't need this, remove and use in ref if need to
  const [isAnimating, setIsAnimating] = React.useState(false);

  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;
  const scaleX = React.useRef(new Animated.Value(1)).current;

  React.useImperativeHandle(ref, () => ({
    animateFlip: async () => {
      setIsAnimating(true);
      onAnimationChange?.(true);

      return new Promise<unknown>((resolve) => {
        Animated.sequence([
          Animated.timing(scaleX, {
            toValue: 0, // Shrink to zero width
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 1, // Expand back to full width
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(resolve);
      }).finally(() => {
        onAnimationChange?.(false);
        setIsAnimating(false);
      });
    },
    animateOut: async ({
      direction,
      animateOpacity = true,
      duration = 300,
    }) => {
      setIsAnimating(true);
      onAnimationChange?.(true);

      return new Promise<unknown>((resolve) => {
        let x = 0,
          y = 0;

        switch (direction) {
          case "top":
            y = -height;
            break;
          case "right":
            x = width;
            break;
          case "bottom":
            y = height;
            break;
          case "left":
            x = -width;
            break;
        }

        const movementAnimation = Animated.parallel([
          Animated.timing(translateX, {
            toValue: x,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: y,
            duration,
            useNativeDriver: true,
          }),
        ]);

        if (animateOpacity) {
          const opacityAnimation = Animated.sequence([
            Animated.delay(duration / 2), // Wait for half of the movement duration
            Animated.timing(opacity, {
              toValue: 0,
              // We need to make sure this finishes fading before the movement finishes, it causes
              // weird flickering issues otherwise
              duration: duration / 3, // Fade out over the second half
              useNativeDriver: true,
            }),
          ]);

          Animated.parallel([movementAnimation, opacityAnimation]).start(
            resolve,
          );
        } else {
          movementAnimation.start(resolve);
        }
      }).finally(() => {
        onAnimationChange?.(false);
        setIsAnimating(false);
      });
    },
  }));

  return {
    height,
    width,
    isAnimating,
    opacity,
    translateX,
    translateY,
    scaleX,
  };
}
