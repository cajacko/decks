import { StyleSheet, Animated } from "react-native";
import { CardProps, AnimatedViewStyle, OffsetPosition } from "./Card.types";

const roundTo1Decimal = (num: number): number => Math.round(num * 10) / 10;

/**
 * Define the minimum amount needed for a stack to look good, so we're not rendering loads of cards
 * in stack.
 */
export function getOffsetPositions(cardWidth: number): OffsetPosition[] {
  return [
    {
      rotate: 0,
      x: 0,
      y: 0,
    },
    {
      y: -roundTo1Decimal(cardWidth / 300),
      x: roundTo1Decimal(cardWidth / 150),
      rotate: 0.6,
    },
    {
      y: roundTo1Decimal(cardWidth / 270),
      x: -roundTo1Decimal(cardWidth / 300),
      rotate: -1.2,
    },
    {
      y: roundTo1Decimal(cardWidth / 250),
      x: -roundTo1Decimal(cardWidth / 170),
      rotate: 1.2,
    },
    {
      y: roundTo1Decimal(cardWidth / 190),
      x: -roundTo1Decimal(cardWidth / 280),
      rotate: -0.6,
    },
  ];
}

export function getBorderRadius(width: number): number {
  return Math.round(width / 20);
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000", // iOS & Android
    shadowOffset: { width: 0, height: 4 }, // iOS only
    shadowOpacity: 0.2, // iOS only
    shadowRadius: 6, // iOS only
    elevation: 6, // Android only
  },
});

export function getCardStyle(props: {
  style?: CardProps["style"];
  width: number;
  height: number;
  opacity: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  scaleX: Animated.Value;
  zIndex?: number;
  offsetPosition?: number;
  rotate: Animated.Value;
}): AnimatedViewStyle {
  const rotate = props.rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const animationStyle: AnimatedViewStyle = {
    transform: [
      { translateX: props.translateX },
      { translateY: props.translateY },
      { scaleX: props.scaleX },
      { rotate },
    ],
    opacity: props.opacity,
  };

  return StyleSheet.flatten<AnimatedViewStyle>([
    styles.container,
    {
      zIndex: props.zIndex,
      width: props.width,
      height: props.height,
      borderRadius: getBorderRadius(props.width),
    },
    animationStyle,
    props.style,
  ]);
}
