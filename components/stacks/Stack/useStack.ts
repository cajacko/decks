import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeCardState, setStackOrder } from "@/store/slices/tabletop";
import {
  selectCardInstanceIds,
  selectFirstXCardInstances,
  selectDoesTabletopHaveCardInstances,
  selectCardInstance,
} from "@/store/selectors/tabletops";
import { StackProps } from "./stack.types";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import seededShuffle, { generateSeed } from "@/utils/seededShuffle";
import { withStackOffsetPositions } from "./stackOffsetPositions";
import {
  useSharedValue,
  withTiming,
  runOnJS,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import { deleteStack } from "@/store/slices/tabletop";
import { useRouter } from "expo-router";
import useFlag from "@/hooks/useFlag";
import useOffsetPositions from "@/components/cards/ui/AnimatedCard/useOffsetPositions";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { selectDoesTabletopHaveAvailableCards } from "@/store/combinedSelectors/tabletops";
import text from "@/constants/text";
import useShakeEffect from "@/hooks/useShakeEffect";
import useVibrate from "@/hooks/useVibrate";
import { dateToDateString } from "@/utils/dates";

export function useStackWidth() {
  const { stackWidth } = useTabletopContext();

  const width = useSharedValue(stackWidth);

  React.useEffect(() => {
    width.value = stackWidth;
  }, [width, stackWidth]);

  return width;
}

export default function useStack({
  stackId,
  stackListRef,
  canDelete = false,
  canShowEditDeck = false,
  isFocussed = false,
}: StackProps) {
  // we just want the length and doing it this way to keep a
  // single source of truth for the number of offset positions
  const offsetPositions = useOffsetPositions();
  // Our fallback needs to be enough for see a card behind when animating
  const offsetPositionsCount = offsetPositions ? offsetPositions.length : 2;
  const width = useStackWidth();
  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";
  const shakeToShuffle = useFlag("SHAKE_TO_SHUFFLE") === "enabled";
  const animateShuffle = useFlag("SHUFFLE_ANIMATION") === "enabled";
  const dispatch = useAppDispatch();
  const { tabletopId, deckId, notify } = useTabletopContext();
  const { vibrate } = useVibrate();
  const opacity = useSharedValue(1);
  const { navigate } = useRouter();
  const shuffleProgress = useSharedValue(0);
  const doesTabletopHaveCards = useAppSelector((state) =>
    selectDoesTabletopHaveCardInstances(state, { tabletopId }),
  );
  const doesTabletopHaveAvailableCards = useAppSelector((state) =>
    selectDoesTabletopHaveAvailableCards(state, { tabletopId }),
  );
  const cardCount = useAppSelector(
    (state) => selectCardInstanceIds(state, { stackId, tabletopId })?.length,
  );

  const { getCardOffsetPosition, onUpdateCardList, stackCountLimit } =
    React.useMemo(
      () => withStackOffsetPositions(offsetPositionsCount),
      [offsetPositionsCount],
    );

  const _cardInstancesIds = useAppSelector((state) =>
    selectFirstXCardInstances(state, {
      stackId,
      tabletopId,
      limit: stackCountLimit,
    }),
  );

  const [cardInstanceIdsOverride, setCardInstanceIdsOverride] = React.useState<
    string[] | null
  >(null);

  const allCardInstanceIds = useAppSelector((state) =>
    selectCardInstanceIds(state, { stackId, tabletopId }),
  );

  const handleShuffle = React.useCallback(async () => {
    let promise: Promise<unknown> | undefined;

    vibrate?.("handleShuffle");

    if (animateShuffle) {
      const duration = 1200;

      promise = new Promise<void>((resolve) => {
        shuffleProgress.value = withTiming(1, { duration }, () => {
          shuffleProgress.value = 0;

          runOnJS(resolve)();
        });
      });
    } else if (!performanceMode) {
      const idsToShuffle = allCardInstanceIds ?? _cardInstancesIds;

      if (idsToShuffle) {
        const iterations = 4;
        const interval = 500;

        promise = new Promise<void>((resolve) => {
          function run() {
            if (!idsToShuffle) return;

            const newIds = seededShuffle(idsToShuffle, generateSeed()).slice(
              0,
              1,
            );

            setCardInstanceIdsOverride(newIds);
          }

          run();

          for (let i = 1; i < iterations; i++) {
            setTimeout(run, i * interval);
          }

          setTimeout(() => {
            setCardInstanceIdsOverride(null);
            resolve();
          }, iterations * interval);
        });
      }
    }

    dispatch(
      setStackOrder({
        stackId,
        allCardInstancesState: "noChange",
        tabletopId,
        method: { type: "shuffle", seed: generateSeed() },
        date: dateToDateString(new Date()),
        operation: {
          type: "SHUFFLE",
          payload: {
            scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
          },
        },
      }),
    );

    await promise;

    setCardInstanceIdsOverride(null);
  }, [
    dispatch,
    stackId,
    tabletopId,
    shuffleProgress,
    animateShuffle,
    vibrate,
    allCardInstanceIds,
    _cardInstancesIds,
    performanceMode,
    stackListRef,
  ]);

  const shakeToShuffleActive: boolean =
    isFocussed === true &&
    shakeToShuffle &&
    !!_cardInstancesIds &&
    _cardInstancesIds.length > 0;

  useShakeEffect(shakeToShuffleActive ? handleShuffle : null);

  onUpdateCardList(_cardInstancesIds ?? []);

  const handleDeleteStack = React.useCallback(async () => {
    stackListRef.current?.onDeleteStack?.(stackId);

    const scroll = stackListRef.current?.scrollPrev?.();

    const transform = new Promise<void>((resolve) => {
      if (canAnimateCards) {
        const toValue = withTiming(0, { duration: 500 }, () => {
          runOnJS(resolve)();
        });

        opacity.value = toValue;
        width.value = toValue;
      } else {
        opacity.value = 0;
        width.value = 0;

        resolve();
      }
    });

    await Promise.all([scroll, transform]);

    dispatch(
      deleteStack({
        tabletopId,
        stackId,
        date: dateToDateString(new Date()),
        operation: {
          type: "DELETE_STACK",
          payload: {
            scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
          },
        },
      }),
    );
  }, [
    stackId,
    width,
    tabletopId,
    dispatch,
    stackListRef,
    opacity,
    canAnimateCards,
  ]);

  const emptyStackButton = React.useMemo(() => {
    if (canDelete) {
      return {
        action: handleDeleteStack,
        title: text["stack.actions.delete"],
      };
    }

    if (doesTabletopHaveCards) return null;
    if (!canShowEditDeck) return null;

    if (doesTabletopHaveAvailableCards) {
      return {
        action: () => {
          dispatch(resetTabletopHelper({ tabletopId }));
        },
        title: text["tabletop.reset.title"],
      };
    }

    return {
      action: () => {
        navigate(`/deck/${deckId}`);
      },
      title: text["stack.actions.edit_deck"],
    };
  }, [
    handleDeleteStack,
    canDelete,
    doesTabletopHaveCards,
    canShowEditDeck,
    doesTabletopHaveAvailableCards,
    deckId,
    dispatch,
    tabletopId,
    navigate,
  ]);

  const firstCardId = _cardInstancesIds?.[0];
  const firstCardSide = useAppSelector((state) =>
    firstCardId
      ? selectCardInstance(state, { cardInstanceId: firstCardId, tabletopId })
          ?.side
      : undefined,
  );

  const handleFlipAll = React.useMemo(() => {
    if (!firstCardSide) return undefined;

    return () => {
      notify?.(
        firstCardSide === "front"
          ? text["stack.notifications.flip_all_down"]
          : text["stack.notifications.flip_all_up"],
      );

      dispatch(
        changeCardState({
          operation: {
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
            type:
              firstCardSide === "front"
                ? "FLIP_STACK_FACE_DOWN"
                : "FLIP_STACK_FACE_UP",
          },
          date: dateToDateString(new Date()),
          target: { stackId },
          tabletopId,
          side: firstCardSide === "front" ? "back" : "front",
        }),
      );
    };
  }, [firstCardSide, stackId, tabletopId, dispatch, stackListRef, notify]);

  const rotation = useDerivedValue<number>(() =>
    interpolate(shuffleProgress.value, [0, 1], [0, 2 * 360]),
  );

  return {
    opacity,
    width,
    cardInstancesIds: cardInstanceIdsOverride ?? _cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    emptyStackButton,
    handleFlipAll,
    shuffleProgress,
    cardCount,
  };
}
