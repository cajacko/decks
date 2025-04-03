import React from "react";
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { useSkeletonAnimation } from "@/context/Skeleton";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface SkeletonProps extends ViewProps {
  variant?: "card" | "text" | "image" | "button";
  shape?: "rectangle" | "circle" | "rounded";
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  borderRadius?: ViewStyle["borderRadius"];
  textSpacingTop?: boolean;
  textSpacingBottom?: boolean;
  textSpacingVertical?: boolean;
}

export default function Skeleton({
  style: styleProp,
  variant,
  shape = "rounded",
  width,
  height,
  borderRadius,
  textSpacingBottom,
  textSpacingTop,
  textSpacingVertical,
  ...props
}: SkeletonProps): React.ReactNode {
  const { backgroundColorStyle } = useSkeletonAnimation();
  const skeletonCardColor = useThemeColor("skeletonCard");

  const style = React.useMemo<StyleProp<ViewStyle>>(() => {
    const sizes: ViewStyle = {};

    if (width !== undefined) {
      sizes.width = width;
    }

    if (height !== undefined) {
      sizes.height = height;
    }

    if (borderRadius !== undefined) {
      sizes.borderRadius = borderRadius;
    }

    if (textSpacingTop) {
      sizes.marginTop = textParagraphSpacing;
    }

    if (textSpacingBottom) {
      sizes.marginBottom = textParagraphSpacing;
    }

    if (textSpacingVertical) {
      sizes.marginVertical = textParagraphSpacing;
    }

    return [
      StyleSheet.flatten([
        variant === "button" && styles.button,
        (shape === "rounded" || variant === "button" || variant === "text") &&
          styles.rounded,
        shape === "circle" && styles.circle,
        variant === "text" && styles.text,
        variant === "card" && { backgroundColor: skeletonCardColor },
        sizes,
        styleProp,
      ]),
      variant !== "card" && backgroundColorStyle,
    ];
  }, [
    styleProp,
    backgroundColorStyle,
    shape,
    height,
    width,
    variant,
    borderRadius,
    textSpacingTop,
    textSpacingBottom,
    textSpacingVertical,
    skeletonCardColor,
  ]);

  return <Animated.View {...props} style={style} />;
}

const textParagraphSpacing = 5;

export const styles = StyleSheet.create({
  rounded: {
    borderRadius: 3,
  },
  circle: {
    borderRadius: 1000,
  },
  button: {
    height: 30,
    width: 100,
  },
  text: {
    height: 20,
  },
});
