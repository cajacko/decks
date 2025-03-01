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
import { deleteStack } from "@/store/slices/tabletop";

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
}: StackProps) {
  const dispatch = useAppDispatch();
  const { tabletopId, stackWidth } = useTabletopContext();
  const width = useSharedValue(stackWidth);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const [showActions, setShowActions] = React.useState(true);

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
    rotation.value = 0;
    setShowActions(false);

    const duration = 500;

    const promise = new Promise<void>((resolve) => {
      rotation.value = withTiming(360, { duration }, () => {
        runOnJS(resolve)();
      });
    });

    await new Promise((resolve) => setTimeout(resolve, duration / 2));

    dispatch(
      setStackOrder({
        stackId,
        allCardInstancesState: "noChange",
        tabletopId,
        seed: generateSeed(),
      }),
    );

    await promise;

    setShowActions(true);
  }, [dispatch, stackId, tabletopId, rotation]);

  onUpdateCardList(cardInstancesIds ?? []);

  const handleDeleteStack = React.useMemo(() => {
    if (!canDelete) return;

    return async () => {
      const scroll = stackListRef.current?.scrollPrev?.();

      const transform = new Promise<void>((resolve) => {
        const toValue = withTiming(0, { duration: 500 }, () => {
          runOnJS(resolve)();
        });

        opacity.value = toValue;
        width.value = toValue;
      });

      await Promise.all([scroll, transform]);

      dispatch(deleteStack({ tabletopId, stackId: stackId }));
    };
  }, [stackId, width, tabletopId, dispatch, stackListRef, opacity, canDelete]);

  return {
    opacity,
    width,
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    showActions,
    rotation,
    handleDeleteStack,
  };
}
