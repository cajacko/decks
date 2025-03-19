import React from "react";
import { AnimatedCardProps, AnimatedCardRef } from "./AnimatedCard.types";
import useAnimatedCard from "./useAnimatedCard";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Card from "@/components/cards/ui/Card";

export default React.forwardRef<AnimatedCardRef, AnimatedCardProps>(
  function AnimatedCard(
    {
      cardStyle,
      initialRotation,
      initialScaleX,
      offsetPosition,
      onAnimationChange,
      style,
      constraints,
      scale,
      physicalSize,
      target,
      sizePreset,
      ...cardProps
    },
    ref,
  ) {
    const state = useAnimatedCard(
      {
        height: cardProps.height,
        width: cardProps.width,
        initialRotation,
        initialScaleX,
        offsetPosition,
        onAnimationChange,
        constraints,
        scale,
        physicalSize,
        target,
        sizePreset,
      },
      ref,
    );

    const animationStyle = useAnimatedStyle(() => ({
      opacity: state.opacity.value === null ? 1 : state.opacity.value,
      transform: [
        {
          translateX: state.translateX.value ?? 0,
        },
        {
          translateY: state.translateY.value ?? 0,
        },
        {
          rotate: state.rotate.value ? `${state.rotate.value}deg` : "0deg",
        },
        {
          scaleX: state.scaleX.value ?? 1,
        },
      ],
    }));

    const containerStyle = React.useMemo(
      () => [animationStyle, style],
      [style, animationStyle],
    );

    // return <View style={{ height: 40, width: 40, backgroundColor: "grey" }} />;

    return (
      <Animated.View style={containerStyle}>
        <Card {...cardProps} style={cardStyle} />
      </Animated.View>
    );
  },
);
