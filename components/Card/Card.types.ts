import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";

export type OffsetPosition = null | {
  x: number | null;
  y: number | null;
  rotate: number | null;
};

export type AnimatedViewStyle = AnimatedStyle<ViewStyle>;

export type RequiredRefObject<T> = { current: T };

export interface CardProps extends Partial<CardSizeContextProps> {
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
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
  initialRotation?: number;
  initialScaleX?: number;
  overlay?: React.ReactNode;
  opacity?: number;
  transform?: ViewStyle["transform"];
  ref?: React.Ref<CardRef>;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
}

export interface CardRef {
  getIsAnimating: () => boolean;
  animateFlipOut: () => Promise<unknown>;
  animateFlipIn: () => Promise<unknown>;
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

export type AnimationUpdate = (key: string, isAnimating: boolean) => void;

export interface CardMMDimensions {
  mmWidth: number;
  mmHeight: number;
  mmBorderRadius: number;
}

export type CardSize =
  | { height: number; width: number }
  | { cardHeight: number; cardWidth: number };

export type CardSizeProps = {
  dpBorderRadius: number;
  dpHeight: number;
  dpWidth: number;
  mmHeight: number;
  mmWidth: number;
  mmBorderRadius: number;
};

export type CardSizeConstraints = {
  height?: number;
  width?: number;
  maxHeight?: number;
  maxWidth?: number;
};

export type CardSizeContextProps = {
  proportions: CardMMDimensions;
  constraints: CardSizeConstraints;
};
