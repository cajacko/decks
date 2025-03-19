// import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import { CardProps } from "@/components/cards/ui/Card";
import { UseMmToDpProps } from "@/components/cards/context/PhysicalMeasures";

export type OffsetPosition = null | {
  x: number | null;
  y: number | null;
  rotate: number | null;
};

export type RequiredRefObject<T> = { current: T };

// "height"
// | "width"
// | "offsetPosition"
// | "initialRotation"
// | "initialScaleX"
// | "onAnimationChange"

export interface AnimatedCardProps
  extends Omit<CardProps, "style">,
    UseMmToDpProps {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  onAnimationChange?: (isAnimating: boolean) => void;
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
  initialRotation?: number;
  initialScaleX?: number;
  cardStyle?: CardProps["style"];

  // innerStyle?: StyleProp<ViewStyle>;
  // hidden?: boolean;
  // zIndex?: number;
  // overlay?: React.ReactNode;
  // opacity?: number;
  // transform?: ViewStyle["transform"];
  // ref?: React.Ref<AnimatedCardRef>;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
  animateBack?: () => Promise<void>;
}

export interface AnimatedCardRef {
  getIsAnimating: () => boolean;
  animateFlipOut: () => Promise<unknown>;
  animateFlipIn: () => Promise<unknown>;
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

export type AnimationUpdate = (key: string, isAnimating: boolean) => void;
