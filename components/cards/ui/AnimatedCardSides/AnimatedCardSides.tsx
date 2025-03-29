import React from "react";
import { StyleSheet, View } from "react-native";
import useAnimatedCardSides from "./useAnimatedCardSides";
import {
  AnimatedCardSidesProps,
  AnimatedCardSidesRef,
} from "./AnimatedCardSides.types";
import AnimatedCard, {
  AnimatedCardProps,
} from "@/components/cards/ui/AnimatedCard";
import CardSpacer from "@/components/cards/ui/CardSpacer";

export default React.forwardRef<AnimatedCardSidesRef, AnimatedCardSidesProps>(
  function AnimatedCardSides({ side, back, front, style }, ref) {
    const state = useAnimatedCardSides(side, ref);
    const { height, width } = side === "front" ? front : back;

    const frontCardProps = React.useMemo(
      (): Partial<AnimatedCardProps> => ({
        style: [front.style, styles.absolute],
        initialRotation: front.initialRotation,
        scaleX: state.frontScaleX,
      }),
      [front.style, front.initialRotation, state.frontScaleX],
    );

    const backCardProps = React.useMemo(
      (): Partial<AnimatedCardProps> => ({
        style: [back.cardStyle, styles.absolute],
        initialRotation: back.initialRotation,
        scaleX: state.backScaleX,
      }),
      [back.cardStyle, back.initialRotation, state.backScaleX],
    );

    const containerStyle = React.useMemo(
      () => StyleSheet.flatten([styles.container, style]),
      [style],
    );

    return (
      <View style={containerStyle}>
        <AnimatedCard {...front} {...frontCardProps} ref={state.faceUpRef} />
        <AnimatedCard {...back} {...backCardProps} ref={state.faceDownRef} />
        <CardSpacer height={height} width={width} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
  },
});
