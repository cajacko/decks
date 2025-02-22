import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  moveCard,
  changeCardState,
  CardInstanceState,
  MoveCardInstanceMethod,
  selectCardInstance,
} from "@/store/slices/tabletop";
import { CardInstanceRef } from "@/components/CardInstance";
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

  const cardInstance = useAppSelector((state) =>
    selectCardInstance(state, { tabletopId, cardInstanceId }),
  );

  if (!cardInstance) {
    throw new Error(`Card with id ${cardInstanceId} not found`);
  }

  const state = cardInstance.state;
  const animateCardMovement = useAnimateCardMovement();
  const dispatch = useAppDispatch();
  const cardRef = React.useRef<CardInstanceRef>(null);
  const [isAnimating, setIsAnimating] = React.useState(
    cardRef.current?.getIsAnimating() ?? false,
  );

  const handleFlipCard = React.useCallback(async () => {
    if (cardRef.current && animateCardMovement) {
      try {
        await cardRef.current.animateFlip();
      } catch {}
    }

    dispatch(
      changeCardState({
        tabletopId,
        cardInstanceId,
        state:
          state === CardInstanceState.faceDown
            ? CardInstanceState.faceUp
            : CardInstanceState.faceDown,
      }),
    );
  }, [dispatch, cardInstanceId, state, tabletopId, animateCardMovement]);

  const moveRight = React.useMemo(() => {
    if (!rightStackId) return undefined;

    return {
      bottom: async () => {
        if (cardRef.current && animateCardMovement) {
          try {
            await cardRef.current.animateOut({
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
        if (cardRef.current && animateCardMovement) {
          try {
            await cardRef.current.animateOut({
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
    cardRef,
    tabletopId,
    animateCardMovement,
  ]);

  const moveLeft = React.useMemo(() => {
    if (!leftStackId) return undefined;

    return {
      bottom: async () => {
        if (cardRef.current && animateCardMovement) {
          try {
            await cardRef.current.animateOut({
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
        if (cardRef.current && animateCardMovement) {
          try {
            await cardRef.current.animateOut({
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
    cardRef,
    tabletopId,
    animateCardMovement,
  ]);

  const handleMoveToBottom = React.useMemo(() => {
    if (!canMoveToBottom) return undefined;

    return async () => {
      if (cardRef.current && animateCardMovement) {
        try {
          await cardRef.current.animateOut({
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
    cardRef,
    tabletopId,
    animateCardMovement,
  ]);

  return {
    cardId: cardInstance.cardId,
    cardRef,
    handleFlipCard,
    moveRight,
    moveLeft,
    handleMoveToBottom,
    setIsAnimating,
    hideActions: isAnimating,
  };
}
