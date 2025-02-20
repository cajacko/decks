import React from "react";
import { StyleSheet, StyleProp, ViewStyle, Animated } from "react-native";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";

export interface CardProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onAnimationChange?: (isAnimating: boolean) => void;
  hidden?: boolean;
}

export interface AnimateOutProps {
  direction: "top" | "right" | "bottom" | "left";
  duration?: number;
  animateOpacity?: boolean;
}

export interface CardRef {
  animateOut: (props: AnimateOutProps) => Promise<unknown>;
}

const Card = React.forwardRef<CardRef, CardProps>(
  ({ style, children, onAnimationChange, ...rest }, ref) => {
    const { cardHeight, cardWidth } = useTabletopContext();

    const translateX = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(1)).current;
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useImperativeHandle(ref, () => ({
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
              y = -cardHeight;
              break;
            case "right":
              x = cardWidth;
              break;
            case "bottom":
              y = cardHeight;
              break;
            case "left":
              x = -cardWidth;
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
          setIsAnimating(false);
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
            width: cardWidth,
            height: cardHeight,
            borderRadius: Math.round(cardWidth / 20),
          },
          style,
          isAnimating ? animationStyle : undefined,
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
