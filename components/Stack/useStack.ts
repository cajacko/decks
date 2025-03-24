import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFirstXCardInstances,
  setStackOrder,
} from "@/store/slices/tabletop";
import { StackProps } from "./stack.types";
import { useTabletopContext } from "../Tabletop/Tabletop.context";
import { generateSeed } from "@/utils/seededShuffle";
import { withStackOffsetPositions } from "./stackOffsetPositions";
import { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import {
  deleteStack,
  selectDoesTabletopHaveCardInstances,
} from "@/store/slices/tabletop";
import { useRouter } from "expo-router";
import useFlag from "@/hooks/useFlag";
import useOffsetPositions from "@/components/cards/ui/AnimatedCard/useOffsetPositions";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { selectDoesTabletopHaveAvailableCards } from "@/store/combinedSelectors/tabletops";
import text from "@/constants/text";
import useShakeEffect from "@/hooks/useShakeEffect";
import useVibrate from "@/hooks/useVibrate";

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

  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const shakeToShuffle = useFlag("SHAKE_TO_SHUFFLE") === "enabled";
  const animateShuffle = useFlag("SHUFFLE_ANIMATION") === "enabled";
  const dispatch = useAppDispatch();
  const { tabletopId, stackWidth, deckId } = useTabletopContext();
  const width = useSharedValue(stackWidth);
  const { vibrate } = useVibrate();
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const { navigate } = useRouter();
  const doesTabletopHaveCards = useAppSelector((state) =>
    selectDoesTabletopHaveCardInstances(state, { tabletopId }),
  );
  const doesTabletopHaveAvailableCards = useAppSelector((state) =>
    selectDoesTabletopHaveAvailableCards(state, { tabletopId }),
  );

  React.useEffect(() => {
    width.value = stackWidth;
  }, [width, stackWidth]);

  const { getCardOffsetPosition, onUpdateCardList, stackCountLimit } =
    React.useMemo(
      () => withStackOffsetPositions(offsetPositionsCount),
      [offsetPositionsCount],
    );

  const cardInstancesIds = useAppSelector((state) =>
    selectFirstXCardInstances(state, {
      stackId,
      tabletopId,
      limit: stackCountLimit,
    }),
  );

  const handleShuffle = React.useCallback(async () => {
    let promise: Promise<unknown> | undefined;

    vibrate?.("handleShuffle");

    if (animateShuffle) {
      rotation.value = 0;

      const duration = 1200;

      promise = new Promise<void>((resolve) => {
        rotation.value = withTiming(
          (Math.round(1500 / 360) - 1) * 360,
          { duration },
          () => {
            runOnJS(resolve)();
          },
        );
      });
    }

    dispatch(
      setStackOrder({
        stackId,
        allCardInstancesState: "noChange",
        tabletopId,
        method: { type: "shuffle", seed: generateSeed() },
      }),
    );

    await promise;
  }, [dispatch, stackId, tabletopId, rotation, animateShuffle, vibrate]);

  const shakeToShuffleActive: boolean =
    isFocussed &&
    shakeToShuffle &&
    !!cardInstancesIds &&
    cardInstancesIds.length > 1;

  useShakeEffect(shakeToShuffleActive ? handleShuffle : null);

  onUpdateCardList(cardInstancesIds ?? []);

  const handleDeleteStack = React.useCallback(async () => {
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

    dispatch(deleteStack({ tabletopId, stackId: stackId }));
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

  return {
    opacity,
    width,
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    emptyStackButton,
    shakeToShuffleActive,
  };
}
