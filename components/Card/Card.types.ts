import React from "react";
import { StyleProp, ViewStyle, Animated } from "react-native";

export type OffsetPosition = { x: number; y: number; rotate: number };

export type AnimatedViewStyle = Animated.WithAnimatedValue<ViewStyle>;

export type RequiredRefObject<T> = { current: T };

export interface CardProps {
  style?: StyleProp<AnimatedViewStyle>;
  children?: React.ReactNode;
  onAnimationChange?: (isAnimating: boolean) => void;
  hidden?: boolean;
  /**
   * We take this and map to a specific slight difference in x/y and rotate position to make cards
   * in a stack to look more natural and not perfectly aligned. We do it here so we can more
   * consistently manage the logic in one place and have similar look/ feel across where we use
   * these.
   *
   * It's also good so we don't apply too many transforms which override each other from different
   * locations. Wrap in views if something needs to do a completely new type of transform
   */
  offsetPosition?: number;
  zIndex?: number;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
}

export interface CardRef {
  getIsAnimating: () => boolean;
  animateFlip: () => Promise<unknown>;
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

export type AnimationUpdate = (key: string, isAnimating: boolean) => void;
