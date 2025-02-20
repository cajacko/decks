import React from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

export interface CardProps {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onAnimationChange?: (isAnimating: boolean) => void;
  onPress?: () => void;
  // TODO: Should we handle angles/ offsets here? It may be a common card property to be jiggled about?
  // offset?: 0 | 1 | 2 | 3 | 4;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
}

export interface CardRef {
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

export const cardSizeRatios = {
  poker: { width: 2.5, height: 3.5 },
};

const Card = React.forwardRef<CardRef, CardProps>(
  (
    { style, width, height, children, onAnimationChange, onPress, ...rest },
    ref
  ) => {
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

    const styleTransform = (style as ViewStyle)?.transform || [];

    // TODO: type properly
    const animationStyle = {
      transform: [...styleTransform, { translateX }, { translateY }],
      opacity,
    } as ViewStyle;

    return (
      <Animated.View
        style={StyleSheet.flatten([
          styles.container,
          {
            width: width,
            height,
            borderRadius: Math.round(width / 20),
          },
          style,
          animationStyle,
        ])}
        {...rest}
      >
        {onPress && (
          <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.pressableBackground} />
          </TouchableWithoutFeedback>
        )}
        {children}
      </Animated.View>
    );
  }
);

export default Card;

const styles = StyleSheet.create({
  pressableBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // zIndex: 10000,
    opacity: 0,
    backgroundColor: "red",
  },
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
