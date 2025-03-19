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
        style: [front.style, state.renderSpacer && styles.absolute],
        initialScaleX:
          state.flipState === "flipping-to-front" ? 0 : front.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-front" ? 0 : front.initialRotation,
      }),
      [front.style, front.initialRotation, state.flipState, state.renderSpacer],
    );

    const backCardProps = React.useMemo(
      (): Partial<AnimatedCardProps> => ({
        style: [back.cardStyle, state.renderSpacer && styles.absolute],
        initialScaleX:
          state.flipState === "flipping-to-back" ? 0 : back.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-back" ? 0 : back.initialRotation,
      }),
      [
        back.cardStyle,
        back.initialRotation,
        state.flipState,
        state.renderSpacer,
      ],
    );

    const containerStyle = React.useMemo(
      () => StyleSheet.flatten([styles.container, style]),
      [style],
    );

    return (
      <View style={containerStyle}>
        {state.renderFaceUp && (
          <AnimatedCard {...front} {...frontCardProps} ref={state.faceUpRef} />
        )}
        {state.renderFaceDown && (
          <AnimatedCard {...back} {...backCardProps} ref={state.faceDownRef} />
        )}
        {state.renderSpacer && <CardSpacer height={height} width={width} />}
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
