import React from "react";
import { useAppDispatch, useRequiredAppSelector } from "@/store/hooks";
import {
  moveCard,
  changeCardState,
  MoveCardInstanceMethod,
  selectCardInstance,
} from "@/store/slices/tabletop";
import { CardSidesRef } from "@/components/CardSides";
import { StackTopCardProps } from "./types";
import useFlag from "@/hooks/useFlag";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import uuid from "@/utils/uuid";

export default function useDispatchActions({
  cardInstanceId,
  stackId,
  canMoveToBottom,
  leftStackId,
  rightStackId,
}: StackTopCardProps) {
  const { tabletopId } = useTabletopContext();

  const animateSendToBack = useFlag("CARD_ANIMATE_SEND_TO_BACK") === "enabled";
  const [animatedToBack, setAnimatedToBack] = React.useState<string | null>(
    null,
  );

  const { cardId, side } = useRequiredAppSelector(
    (state) => selectCardInstance(state, { tabletopId, cardInstanceId }),
    useDispatchActions.name,
  );

  const animateCardMovement = useFlag("CARD_ANIMATIONS") === "enabled";
  const dispatch = useAppDispatch();
  const cardInstanceRef = React.useRef<CardSidesRef>(null);
  const [isAnimating, setIsAnimating] = React.useState(
    cardInstanceRef.current?.getIsAnimating() ?? false,
  );

  const handleFlipCard = React.useCallback(async () => {
    if (cardInstanceRef.current && animateCardMovement) {
      try {
        await cardInstanceRef.current.animateFlip();
      } catch {}
    }

    dispatch(
      changeCardState({
        tabletopId,
        target: { cardInstanceId },
        side: side === "back" ? "front" : "back",
      }),
    );
  }, [dispatch, cardInstanceId, side, tabletopId, animateCardMovement]);

  const moveRight = React.useMemo(() => {
    return {
      bottom: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "right",
            });
          } catch {}
        }

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            toTarget: rightStackId
              ? { stackId: rightStackId }
              : { stackId: uuid(), newStackDirection: "end" },
            method: MoveCardInstanceMethod.bottomNoChange,
          }),
        );
      },
      top: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "right",
            });
          } catch {}
        }

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            toTarget: rightStackId
              ? { stackId: rightStackId }
              : { stackId: uuid(), newStackDirection: "end" },
            method: MoveCardInstanceMethod.topNoChange,
          }),
        );
      },
    };
  }, [
    dispatch,
    cardInstanceId,
    rightStackId,
    cardInstanceRef,
    tabletopId,
    animateCardMovement,
  ]);

  const moveLeft = React.useMemo(() => {
    // Disabling this until we want to tackle the auto scrolling when editing number of stacks
    if (!leftStackId) return undefined;

    return {
      bottom: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "left",
            });
          } catch {}
        }

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            method: MoveCardInstanceMethod.bottomNoChange,
            toTarget: leftStackId
              ? { stackId: leftStackId }
              : { stackId: uuid(), newStackDirection: "start" },
          }),
        );
      },
      top: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "left",
            });
          } catch {}
        }

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            method: MoveCardInstanceMethod.topNoChange,
            toTarget: leftStackId
              ? { stackId: leftStackId }
              : { stackId: uuid(), newStackDirection: "start" },
          }),
        );
      },
    };
  }, [
    dispatch,
    cardInstanceId,
    leftStackId,
    cardInstanceRef,
    tabletopId,
    animateCardMovement,
  ]);

  const handleMoveToBottom = React.useMemo(() => {
    if (!canMoveToBottom) return undefined;

    return async () => {
      if (cardInstanceRef.current && animateCardMovement) {
        try {
          await cardInstanceRef.current.animateOut({
            direction: "top",
            animateBack: animateSendToBack
              ? async () => {
                  setAnimatedToBack(cardInstanceId);
                }
              : undefined,
          });
        } catch {}
      }

      dispatch(
        moveCard({
          tabletopId,
          moveTarget: { cardInstanceId },
          method: MoveCardInstanceMethod.bottomNoChange,
          toTarget: { stackId: stackId },
        }),
      );
    };
  }, [
    animateSendToBack,
    dispatch,
    cardInstanceId,
    stackId,
    canMoveToBottom,
    cardInstanceRef,
    tabletopId,
    animateCardMovement,
  ]);

  return {
    side,
    tabletopId,
    cardId,
    cardInstanceRef,
    handleFlipCard,
    moveRight,
    moveLeft,
    handleMoveToBottom,
    setIsAnimating,
    hideActions: isAnimating,
    animatedToBack,
  };
}
