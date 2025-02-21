import React from "react";
import CardFront from "@/components/CardFront";
import CardBack from "@/components/CardBack";
import useCardInstance from "./useCardInstance";
import { CardInstanceProps, CardInstanceRef } from "./CardInstance.types";

export default React.forwardRef<CardInstanceRef, CardInstanceProps>(
  function CardInstance({ cardInstanceId, ...rest }, ref) {
    const state = useCardInstance({ cardInstanceId }, ref);

    return (
      <>
        {state.renderFaceUp && (
          <CardFront
            cardId={state.cardInstance.cardId}
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
          <CardBack
            cardId={state.cardInstance.cardId}
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
