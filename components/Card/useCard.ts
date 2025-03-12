import React from "react";
import { Animated } from "react-native";
import { CardProps, CardRef } from "./Card.types";
// import { useTabletopContext } from "../Tabletop/Tabletop.context";
import {
  withAnimateOut,
  withAnimateFlipIn,
  withAnimateFlipOut,
} from "./animations";
// import { getOffsetPositions, parseCardSize } from "./card.styles";
import { getOffsetPositions } from "./card.styles";
import { getOffsetPosition } from "@/components/Stack/stackOffsetPositions";
import { useCardSizes } from "./CardSize.context";
import useFlag from "@/hooks/useFlag";

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

  // const { height, width } = parseCardSize(useTabletopContext());

  const offsetPositions = React.useMemo(
    () => getOffsetPositions(cardSizes),
    [cardSizes],
  );

  const offsetPosition = React.useMemo(
    () => getOffsetPosition(offsetPositions, props.offsetPosition),
    [offsetPositions, props.offsetPosition],
  );

  const isAnimatingRef = React.useRef<Record<string, boolean | undefined>>({});
  const translateX = React.useRef(new Animated.Value(offsetPosition.x ?? 0));
  const translateY = React.useRef(new Animated.Value(offsetPosition.y ?? 0));

  const rotate = React.useRef(
    new Animated.Value(props.initialRotation ?? offsetPosition.rotate ?? 0),
  );

  const opacity = React.useRef(new Animated.Value(1));
  const scaleX = React.useRef(new Animated.Value(props.initialScaleX ?? 1));

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
    prepareForFlipIn: () => {
      scaleX.current.setValue(0);
      rotate.current.setValue(0);
    },
    animateFlipOut: withAnimateFlipOut({
      animationUpdate: animationUpdateRef,
      scaleX,
      rotate,
      initialRotation,
      canAnimate,
    }),
    animateFlipIn: withAnimateFlipIn({
      animationUpdate: animationUpdateRef,
      scaleX,
      rotate,
      initialRotation,
      canAnimate,
    }),
    animateOut: withAnimateOut({
      animationUpdate: animationUpdateRef,
      translateX,
      height: heightRef,
      opacity,
      translateY,
      width: widthRef,
      canAnimate,
    }),
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
