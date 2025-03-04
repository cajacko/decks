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
        cardInstanceId,
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
            cardInstanceId,
            toStackId: rightStackId ?? uuid(),
            method: MoveCardInstanceMethod.bottomNoChange,
            newStackDirection: "end",
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
            toStackId: rightStackId ?? uuid(),
            method: MoveCardInstanceMethod.topNoChange,
            newStackDirection: "end",
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
            cardInstanceId,
            toStackId: leftStackId ?? uuid(),
            method: MoveCardInstanceMethod.bottomNoChange,
            newStackDirection: "start",
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
            toStackId: leftStackId ?? uuid(),
            method: MoveCardInstanceMethod.topNoChange,
            newStackDirection: "start",
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
          });
        } catch {}
      }

      dispatch(
        moveCard({
          tabletopId,
          cardInstanceId,
          toStackId: stackId,
          method: MoveCardInstanceMethod.bottomNoChange,
          newStackDirection: "end",
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
