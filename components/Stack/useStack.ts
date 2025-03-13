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
import { getOffsetPositions } from "@/components/Card/card.styles";
import {
  getCardSizes,
  defaultCardDpWidth,
  defaultCardDimensions,
} from "../Card/cardSizes";
import { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import {
  deleteStack,
  selectDoesTabletopHaveCards,
} from "@/store/slices/tabletop";
import { useRouter } from "expo-router";
import useFlag from "@/hooks/useFlag";

// These dummy values aren't getting used, we just want the length and doing it this way to keep a
// single source of truth for the number of offset positions.
const offsetPositionsCount = getOffsetPositions(
  getCardSizes({
    constraints: { width: defaultCardDpWidth },
    proportions: defaultCardDimensions,
  }),
).length;

export default function useStack({
  stackId,
  stackListRef,
  canDelete = false,
  canShowEditDeck = false,
}: StackProps) {
  const canAnimateCards = useFlag("CARD_ANIMATIONS") === "enabled";
  const dispatch = useAppDispatch();
  const { tabletopId, stackWidth, deckId } = useTabletopContext();
  const width = useSharedValue(stackWidth);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const { navigate } = useRouter();
  const doesTabletopHaveCards = useAppSelector((state) =>
    selectDoesTabletopHaveCards(state, { tabletopId }),
  );

  React.useEffect(() => {
    width.value = stackWidth;
  }, [width, stackWidth]);

  const { getCardOffsetPosition, onUpdateCardList, stackCountLimit } =
    React.useMemo(() => withStackOffsetPositions(offsetPositionsCount), []);

  const cardInstancesIds = useAppSelector((state) =>
    selectFirstXCardInstances(state, {
      stackId,
      tabletopId,
      limit: stackCountLimit,
    }),
  );

  const handleShuffle = React.useCallback(async () => {
    let promise: Promise<unknown> | undefined;

    if (canAnimateCards) {
      rotation.value = 0;

      const duration = 500;

      promise = new Promise<void>((resolve) => {
        rotation.value = withTiming(360, { duration }, () => {
          runOnJS(resolve)();
        });
      });
    }

    dispatch(
      setStackOrder({
        stackId,
        allCardInstancesState: "noChange",
        tabletopId,
        seed: generateSeed(),
      }),
    );

    await promise;
  }, [dispatch, stackId, tabletopId, rotation, canAnimateCards]);

  onUpdateCardList(cardInstancesIds ?? []);

  const handleDeleteStack = React.useMemo(() => {
    if (!canDelete) return;

    return async () => {
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
    };
  }, [
    stackId,
    width,
    tabletopId,
    dispatch,
    stackListRef,
    opacity,
    canDelete,
    canAnimateCards,
  ]);

  const handleEditDeck = React.useMemo(() => {
    if (doesTabletopHaveCards) return;
    if (!canShowEditDeck) return;

    return async () => {
      navigate(`/deck/${deckId}`);
    };
  }, [doesTabletopHaveCards, deckId, navigate, canShowEditDeck]);

  return {
    opacity,
    width,
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    handleDeleteStack,
    handleEditDeck,
  };
}
