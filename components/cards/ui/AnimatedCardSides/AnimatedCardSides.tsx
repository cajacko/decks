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

    const frontStyle = React.useMemo(
      (): AnimatedCardProps["style"] => [
        front.style,
        state.renderSpacer && styles.absolute,
      ],
      [front.style, state.renderSpacer],
    );

    const backStyle = React.useMemo(
      (): AnimatedCardProps["style"] => [
        back.cardStyle,
        state.renderSpacer && styles.absolute,
      ],
      [back.cardStyle, state.renderSpacer],
    );

    const containerStyle = React.useMemo(
      () => StyleSheet.flatten([styles.container, style]),
      [style],
    );

    return (
      <View style={containerStyle}>
        {state.renderFaceUp && (
          <AnimatedCard
            {...front}
            _templateKey={state._templateKey}
            initialScaleX={
              state.flipState === "flipping-to-front" ? 0 : front.initialScaleX
            }
            style={frontStyle}
            ref={state.faceUpRef}
          />
        )}
        {state.renderFaceDown && (
          <AnimatedCard
            {...back}
            _templateKey={state._templateKey}
            initialScaleX={
              state.flipState === "flipping-to-back" ? 0 : back.initialScaleX
            }
            style={backStyle}
            ref={state.faceDownRef}
          />
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
