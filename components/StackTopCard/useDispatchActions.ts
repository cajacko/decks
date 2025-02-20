import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  moveCard,
  changeCardState,
  CardInstanceState,
  MoveCardInstanceMethod,
} from "@/store/slices/stacks";
import { CardRef } from "@/components/Card";
import { StackTopCardProps } from "./types";
import { selectUserSettings } from "@/store/slices/userSettings";

export default function useDispatchActions({
  cardInstanceId,
  stackId,
  canMoveToBottom,
  leftStackId,
  rightStackId,
  state,
}: StackTopCardProps) {
  const { animateCardMovement } = useAppSelector(selectUserSettings);
  const dispatch = useAppDispatch();
  const cardRef = React.useRef<CardRef>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);

  const handleFlipCard = React.useCallback(() => {
    dispatch(
      changeCardState({
        cardInstanceId,
        stackId,
        state:
          state === CardInstanceState.faceDown
            ? CardInstanceState.faceUp
            : CardInstanceState.faceDown,
      })
    );
  }, [dispatch, cardInstanceId, stackId, state]);

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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: rightStackId,
            method: MoveCardInstanceMethod.bottomNoChange,
          })
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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: rightStackId,
            method: MoveCardInstanceMethod.topNoChange,
          })
        );
      },
    };
  }, [dispatch, cardInstanceId, stackId, rightStackId, cardRef]);

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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: leftStackId,
            method: MoveCardInstanceMethod.bottomNoChange,
          })
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
            cardInstanceId,
            fromStackId: stackId,
            toStackId: leftStackId,
            method: MoveCardInstanceMethod.topNoChange,
          })
        );
      },
    };
  }, [dispatch, cardInstanceId, stackId, leftStackId, cardRef]);

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
          cardInstanceId,
          fromStackId: stackId,
          toStackId: stackId,
          method: MoveCardInstanceMethod.bottomNoChange,
        })
      );
    };
  }, [dispatch, cardInstanceId, stackId, canMoveToBottom, cardRef]);

  return {
    cardRef,
    handleFlipCard,
    moveRight,
    moveLeft,
    handleMoveToBottom,
    setIsAnimating,
    showActions: !isAnimating && showActions,
    handleCardPress: () => {
      setShowActions(true);

      setTimeout(() => {
        setShowActions(false);
      }, 2000);
    },
  };
}
