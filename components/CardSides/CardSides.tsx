import React from "react";
import { StyleSheet, View } from "react-native";
import useCardSides from "./useCardSides";
import { CardSidesProps, CardSidesRef } from "./CardSides.types";
import CardSide from "@/components/CardSide";
import CardSpacer from "@/components/CardSpacer";

export default React.forwardRef<CardSidesRef, CardSidesProps>(
  function CardInstance({ id, type, side, CardProps, style }, ref) {
    const state = useCardSides(side, ref);

    const frontCardProps = React.useMemo(
      () => ({
        ...CardProps,
        style: [CardProps?.style, state.renderSpacer && styles.absolute],
        initialScaleX:
          state.flipState === "flipping-to-front"
            ? 0
            : CardProps?.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-front"
            ? 0
            : CardProps?.initialRotation,
      }),
      [CardProps, state.flipState, state.renderSpacer],
    );

    const backCardProps = React.useMemo(
      () => ({
        ...CardProps,
        style: [CardProps?.style, state.renderSpacer && styles.absolute],
        initialScaleX:
          state.flipState === "flipping-to-back"
            ? 0
            : CardProps?.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-back"
            ? 0
            : CardProps?.initialRotation,
      }),
      [CardProps, state.flipState, state.renderSpacer],
    );

    const containerStyle = React.useMemo(
      () => StyleSheet.flatten([styles.container, style]),
      [style],
    );

    return (
      <View style={containerStyle}>
        {state.renderFaceUp && (
          <CardSide
            id={id}
            type={type}
            side="front"
            CardProps={frontCardProps}
            ref={state.faceUpRef}
          />
        )}
        {state.renderFaceDown && (
          <CardSide
            id={id}
            type={type}
            side="back"
            CardProps={backCardProps}
            ref={state.faceDownRef}
          />
        )}
        {state.renderSpacer && (
          <CardSpacer {...CardProps} style={[CardProps?.style]} />
        )}
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
