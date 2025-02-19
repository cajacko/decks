import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from "react-native";

export interface CardProps {
  width?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onAnimationChange?: (isAnimating: boolean) => void;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
}

export interface CardRef {
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

const defaultWidth = 200;

export const getCardHeight = (width: number | null): number =>
  Math.round((width ?? defaultWidth) * 1.4);

const Card = React.forwardRef<CardRef, CardProps>(
  (
    { style, width = defaultWidth, children, onAnimationChange, ...rest },
    ref
  ) => {
    const height = getCardHeight(width);

    const translateX = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(1)).current;

    React.useImperativeHandle(ref, () => ({
      animateOut: async ({
        direction,
        animateOpacity = true,
        duration = 500,
      }) => {
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
                duration: duration / 2, // Fade out over the second half
                useNativeDriver: true,
              }),
            ]);

            Animated.parallel([movementAnimation, opacityAnimation]).start(
              resolve
            );
          } else {
            movementAnimation.start(resolve);
          }
        }).finally(() => {
          onAnimationChange?.(false);
        });
      },
    }));

    return (
      <Animated.View
        style={StyleSheet.flatten([
          styles.container,
          {
            width: width,
            height,
            borderRadius: Math.round(width / 20),
            transform: [{ translateX }, { translateY }],
            opacity,
          },
          style,
        ])}
        {...rest}
      >
        {children}
      </Animated.View>
    );
  }
);

export default Card;

const styles = StyleSheet.create({
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
