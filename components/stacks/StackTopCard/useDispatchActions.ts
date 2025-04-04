import React from "react";
import { useAppDispatch, useRequiredAppSelector } from "@/store/hooks";
import {
  moveCard,
  changeCardState,
  MoveCardInstanceMethod,
} from "@/store/slices/tabletop";
import { selectCardInstance } from "@/store/selectors/tabletops";
import { AnimatedCardSidesRef } from "@/components/cards/connected/AnimatedCardSides";
import { StackTopCardProps } from "./types";
import useFlag from "@/hooks/useFlag";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import uuid from "@/utils/uuid";
import { dateToDateString } from "@/utils/dates";

export default function useDispatchActions({
  cardInstanceId,
  stackId,
  canMoveToBottom,
  leftStackId,
  rightStackId,
  stackListRef,
}: StackTopCardProps) {
  const { tabletopId, deckId } = useTabletopContext();

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
  const cardInstanceRef = React.useRef<AnimatedCardSidesRef>(null);
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
        date: dateToDateString(new Date()),
        operation: {
          type: "FLIP_CARD",
          payload: {
            scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
          },
        },
      }),
    );
  }, [
    dispatch,
    cardInstanceId,
    side,
    tabletopId,
    animateCardMovement,
    stackListRef,
  ]);

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
            date: dateToDateString(new Date()),
            operation: {
              type: "MOVE_CARD_RIGHT_TO_BOTTOM",
              payload: {
                scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
              },
            },
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
            date: dateToDateString(new Date()),
            operation: {
              type: "MOVE_CARD_RIGHT_TO_TOP",
              payload: {
                scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
              },
            },
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
    stackListRef,
  ]);

  const moveLeft = React.useMemo(() => {
    return {
      bottom: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "left",
            });
          } catch {}
        }

        const isNew = !leftStackId;

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            method: MoveCardInstanceMethod.bottomNoChange,
            date: dateToDateString(new Date()),
            toTarget: leftStackId
              ? { stackId: leftStackId }
              : { stackId: uuid(), newStackDirection: "start" },
            operation: {
              type: "MOVE_CARD_LEFT_TO_BOTTOM",
              payload: {
                scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
              },
            },
          }),
        );

        if (isNew) {
          stackListRef.current?.scrollNext?.({ animated: false });
        }
      },
      top: async () => {
        if (cardInstanceRef.current && animateCardMovement) {
          try {
            await cardInstanceRef.current.animateOut({
              direction: "left",
            });
          } catch {}
        }

        const isNew = !leftStackId;

        dispatch(
          moveCard({
            tabletopId,
            moveTarget: { cardInstanceId },
            method: MoveCardInstanceMethod.topNoChange,
            date: dateToDateString(new Date()),
            toTarget: leftStackId
              ? { stackId: leftStackId }
              : { stackId: uuid(), newStackDirection: "start" },
            operation: {
              type: "MOVE_CARD_LEFT_TO_TOP",
              payload: {
                scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
              },
            },
          }),
        );

        if (isNew) {
          stackListRef.current?.scrollNext?.({ animated: false });
        }
      },
    };
  }, [
    dispatch,
    cardInstanceId,
    leftStackId,
    cardInstanceRef,
    tabletopId,
    animateCardMovement,
    stackListRef,
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
          date: dateToDateString(new Date()),
          operation: {
            type: "MOVE_CARD_TO_BOTTOM",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
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
    stackListRef,
  ]);

  return {
    deckId,
    side,
    tabletopId,
    cardId,
    cardInstanceRef,
    handleFlipCard,
    moveRight,
    moveLeft,
    handleMoveToBottom,
    setIsAnimating,
    isAnimating,
    animatedToBack,
  };
}
