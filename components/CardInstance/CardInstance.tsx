import React from "react";
import useCardInstance from "./useCardInstance";
import { CardInstanceProps, CardInstanceRef } from "./CardInstance.types";
import CardSide from "@/components/CardSide";

export default React.forwardRef<CardInstanceRef, CardInstanceProps>(
  function CardInstance({ cardInstanceId, ...rest }, ref) {
    const state = useCardInstance({ cardInstanceId }, ref);

    return (
      <>
        {state.renderFaceUp && (
          <CardSide
            cardId={state.cardInstance.cardId}
            side="front"
            {...rest}
            initialScaleX={
              state.flipState === "flipping-to-front" ? 0 : rest.initialRotation
            }
            initialRotation={
              state.flipState === "flipping-to-front" ? 0 : rest.initialRotation
            }
            ref={state.faceUpRef}
          />
        )}

        {state.renderFaceDown && (
          <CardSide
            cardId={state.cardInstance.cardId}
            side="back"
            {...rest}
            initialScaleX={
              state.flipState === "flipping-to-back" ? 0 : rest.initialRotation
            }
            initialRotation={
              state.flipState === "flipping-to-back" ? 0 : rest.initialRotation
            }
            ref={state.faceDownRef}
          />
        )}
      </>
    );
  },
);
