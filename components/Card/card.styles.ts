import { StyleSheet, Animated, TransformsStyle } from "react-native";
import { CardProps, AnimatedViewStyle } from "./Card.types";

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
  styleProp?: CardProps["style"];
  width: number;
  height: number;
  // TODO: Remove this constraint and we have less renders
  isAnimating: boolean;
  opacity: Animated.Value;
  translateX: Animated.Value;
  translateY: Animated.Value;
  scaleX: Animated.Value;
}): AnimatedViewStyle {
  // FIXME:
  const styleTransform = (props.styleProp as any)?.transform;

  const animationStyle: AnimatedViewStyle = {
    transform: [
      ...styleTransform,
      { translateX: props.translateX },
      { translateY: props.translateY },
      { scaleX: props.scaleX },
    ],
    opacity: props.opacity,
  };

  return StyleSheet.flatten<AnimatedViewStyle>([
    styles.container,
    {
      width: props.width,
      height: props.height,
      borderRadius: getBorderRadius(props.width),
    },
    props.styleProp,
    props.isAnimating ? animationStyle : undefined,
  ]);
}
