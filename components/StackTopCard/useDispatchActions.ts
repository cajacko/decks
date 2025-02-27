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
import { useAnimateCardMovement } from "@/hooks/useFlag";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export default function useDispatchActions({
  cardInstanceId,
  stackId,
  canMoveToBottom,
  leftStackId,
  rightStackId,
}: StackTopCardProps) {
  const { tabletopId } = useTabletopContext();

  const { cardId, side } = useRequiredAppSelector(
    (state) => selectCardInstance(state, { tabletopId, cardInstanceId }),
    useDispatchActions.name,
  );

  const animateCardMovement = useAnimateCardMovement();
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
        cardInstanceId,
        side: side === "back" ? "front" : "back",
      }),
    );
  }, [dispatch, cardInstanceId, side, tabletopId, animateCardMovement]);

  const moveRight = React.useMemo(() => {
    if (!rightStackId) return undefined;

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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: rightStackId,
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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: rightStackId,
            method: MoveCardInstanceMethod.topNoChange,
          }),
        );
      },
    };
  }, [
    dispatch,
    cardInstanceId,
    stackId,
    rightStackId,
    cardInstanceRef,
    tabletopId,
    animateCardMovement,
  ]);

  const moveLeft = React.useMemo(() => {
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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: leftStackId,
            method: MoveCardInstanceMethod.bottomNoChange,
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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: leftStackId,
            method: MoveCardInstanceMethod.topNoChange,
          }),
        );
      },
    };
  }, [
    dispatch,
    cardInstanceId,
    stackId,
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
          });
        } catch {}
      }

      dispatch(
        moveCard({
          tabletopId,
          cardInstanceId,
          fromStackId: stackId,
          toStackId: stackId,
          method: MoveCardInstanceMethod.bottomNoChange,
        }),
      );
    };
  }, [
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
  };
}
