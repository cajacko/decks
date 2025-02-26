import React from "react";
import useCardInstance from "./useCardInstance";
import { CardInstanceProps, CardInstanceRef } from "./CardInstance.types";
import CardSide from "@/components/CardSide";

export default React.forwardRef<CardInstanceRef, CardInstanceProps>(
  function CardInstance({ cardInstanceId, CardProps }, ref) {
    const state = useCardInstance({ cardInstanceId }, ref);

    const frontCardProps = React.useMemo(
      () => ({
        ...CardProps,
        initialScaleX:
          state.flipState === "flipping-to-front"
            ? 0
            : CardProps?.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-front"
            ? 0
            : CardProps?.initialRotation,
      }),
      [CardProps, state.flipState],
    );

    const backCardProps = React.useMemo(
      () => ({
        ...CardProps,
        initialScaleX:
          state.flipState === "flipping-to-back"
            ? 0
            : CardProps?.initialRotation,
        initialRotation:
          state.flipState === "flipping-to-back"
            ? 0
            : CardProps?.initialRotation,
      }),
      [CardProps, state.flipState],
    );

    return (
      <>
        {state.renderFaceUp && (
          <CardSide
            id={state.cardInstance.cardId}
            type="card"
            side="front"
            CardProps={frontCardProps}
            ref={state.faceUpRef}
          />
        )}

        {state.renderFaceDown && (
          <CardSide
            id={state.cardInstance.cardId}
            type="card"
            side="back"
            CardProps={backCardProps}
            ref={state.faceDownRef}
          />
        )}
      </>
    );
  },
);
