import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFirstXCardInstances,
  shuffleStack,
} from "@/store/slices/tabletop";
import { selectUserSettings } from "@/store/slices/userSettings";
import { StackProps, StackDimensions } from "./stack.types";

export default function useStack(
  { stackId, tabletopId }: StackProps,
  { positionStyles }: StackDimensions
) {
  const dispatch = useAppDispatch();

  const { animateCardMovement } = useAppSelector(selectUserSettings);
  const limit = animateCardMovement
    ? positionStyles.length * 2
    : positionStyles.length;

  const cardInstances = useAppSelector((state) =>
    selectFirstXCardInstances(state, {
      stackId,
      tabletopId,
      limit,
    })
  );

  const handleShuffle = React.useCallback(() => {
    dispatch(
      shuffleStack({ stackId, allCardInstancesState: "noChange", tabletopId })
    );
  }, [dispatch, stackId, tabletopId]);

  const cardInstancesIds = React.useMemo(
    () => cardInstances?.map(({ cardInstanceId }) => cardInstanceId) ?? [],
    [cardInstances]
  );

  const cardPositions = React.useRef<Array<string | null>>([]);

  // We need to reset the mapping so when cards come back in to the stack they don't adopt their old
  // position, instead following the first available position.
  React.useEffect(() => {
    cardPositions.current.forEach((cardInstanceId, i) => {
      if (cardInstanceId === null) return;
      if (cardInstancesIds.includes(cardInstanceId)) return null;

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

        if (!cardInstanceId || !cardInstancesIds.includes(cardInstanceId)) {
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
    cardInstances,
    getCardPositionStyle,
    handleShuffle,
  };
}
