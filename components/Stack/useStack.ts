import React from "react";
import { Animated } from "react-native";
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

const offsetPositionsCount = getOffsetPositions({ height: 0, width: 0 }).length;

export default function useStack({ stackId }: StackProps) {
  const dispatch = useAppDispatch();
  const { tabletopId } = useTabletopContext();

  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const [showActions, setShowActions] = React.useState(true);

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
    rotateAnim.setValue(0);
    setShowActions(false);

    const promise = new Promise((resolve) => {
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(resolve);
    });

    await new Promise((resolve) => setTimeout(resolve, 250));

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
  }, [dispatch, stackId, tabletopId, rotateAnim]);

  onUpdateCardList(cardInstancesIds ?? []);

  return {
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotateAnim,
    showActions,
  };
}
