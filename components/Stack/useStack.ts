import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFirstXCardInstances,
  setStackOrder,
} from "@/store/slices/tabletop";
import { selectUserSettings } from "@/store/slices/userSettings";
import { StackProps, StackDimensions } from "./stack.types";
import { useTabletopContext } from "../Tabletop/Tabletop.context";

export default function useStack(
  { stackId }: StackProps,
  { positionStyles }: StackDimensions
) {
  const dispatch = useAppDispatch();
  const { tabletopId } = useTabletopContext();

  const { animateCardMovement } = useAppSelector(selectUserSettings);
  const limit = animateCardMovement
    ? positionStyles.length * 2
    : positionStyles.length;

  const cardInstancesIds = useAppSelector((state) =>
    selectFirstXCardInstances(state, {
      stackId,
      tabletopId,
      limit,
    })
  );

  const handleShuffle = React.useCallback(() => {
    const randomOrder = cardInstancesIds?.sort(() => Math.random() - 0.5);

    dispatch(
      setStackOrder({
        stackId,
        allCardInstancesState: "noChange",
        tabletopId,
        cardInstanceIds: randomOrder ?? [],
      })
    );
  }, [dispatch, stackId, tabletopId, cardInstancesIds]);

  const cardPositions = React.useRef<Array<string | null>>([]);

  // We need to reset the mapping so when cards come back in to the stack they don't adopt their old
  // position, instead following the first available position.
  React.useEffect(() => {
    cardPositions.current.forEach((cardInstanceId, i) => {
      if (cardInstanceId === null) return;
      if (cardInstancesIds && cardInstancesIds.includes(cardInstanceId))
        return null;

      cardPositions.current[i] = null;
    });
  }, [cardInstancesIds, cardPositions]);

  const getCardPositionStyle = (props: {
    cardInstanceId: string;
    isTopCard: boolean;
  }): StyleProp<ViewStyle> | undefined => {
    const index = cardPositions.current.indexOf(props.cardInstanceId);

    if (index === -1) {
      for (let i = 0; i < limit; i++) {
        const cardInstanceId = cardPositions.current[i];

        if (!cardInstanceId || !cardInstancesIds?.includes(cardInstanceId)) {
          cardPositions.current[i] = props.cardInstanceId;

          return positionStyles[i];
        }
      }
    } else {
      // This accounts for our double rendering of cards for animations
      return positionStyles[index % positionStyles.length];
    }
  };

  return {
    cardInstancesIds,
    getCardPositionStyle,
    handleShuffle,
  };
}
