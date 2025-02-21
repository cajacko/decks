import React from "react";
import { Animated } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import { withAnimateOut, withAnimateFlip } from "./animations";
import { getOffsetPositions } from "./card.styles";
import { getOffsetPosition } from "@/components/Stack/stackOffsetPositions";

export default function useCard(
  props: Pick<CardProps, "onAnimationChange" | "offsetPosition">,
  ref: React.ForwardedRef<CardRef>,
) {
  const { cardHeight: height, cardWidth: width } = useTabletopContext();

  const offsetPositions = React.useMemo(
    () => getOffsetPositions(width),
    [width],
  );

  const offsetPosition = React.useMemo(
    () => getOffsetPosition(offsetPositions, props.offsetPosition),
    [offsetPositions, props.offsetPosition],
  );

  const isAnimatingRef = React.useRef<Record<string, boolean | undefined>>({});

  const translateX = React.useRef(
    new Animated.Value(offsetPosition.x ?? 0),
  ).current;

  const translateY = React.useRef(
    new Animated.Value(offsetPosition.y ?? 0),
  ).current;

  const rotate = React.useRef(
    new Animated.Value(offsetPosition.rotate ?? 0),
  ).current;

  const opacity = React.useRef(new Animated.Value(1)).current;
  const scaleX = React.useRef(new Animated.Value(1)).current;

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
  const initialRotation = React.useRef(offsetPosition.rotate);

  animationUpdateRef.current = animationUpdate;
  heightRef.current = height;
  widthRef.current = width;
  initialRotation.current = offsetPosition.rotate;

  React.useImperativeHandle(ref, () => ({
    getIsAnimating,
    animateFlip: withAnimateFlip({
      animationUpdate: animationUpdateRef,
      scaleX,
      rotate,
      initialRotation,
    }),
    animateOut: withAnimateOut({
      animationUpdate: animationUpdateRef,
      translateX,
      height: heightRef,
      opacity,
      translateY,
      width: widthRef,
    }),
  }));

  return {
    height,
    width,
    opacity,
    translateX,
    translateY,
    scaleX,
    rotate,
  };
}
