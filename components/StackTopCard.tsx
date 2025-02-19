import React from "react";
import { StyleSheet, View } from "react-native";
import CardInstance, { CardInstanceProps } from "./CardInstance";
import { useAppDispatch } from "@/store/hooks";
import {
  moveCard,
  changeCardState,
  CardInstanceState,
  MoveCardInstanceMethod,
} from "@/store/slices/stacks";
import CardAction, { size } from "./CardAction";

export interface StackTopCardProps extends CardInstanceProps {
  stackId: string;
  cardInstanceId: string;
  leftStackId?: string;
  rightStackId?: string;
  canMoveToBottom?: boolean;
}

const sideActionGap = size / 4;

export default function StackTopCard({
  stackId,
  cardInstanceId,
  leftStackId,
  rightStackId,
  canMoveToBottom,
  ...rest
}: StackTopCardProps): React.ReactNode {
  const { state } = rest;

  const dispatch = useAppDispatch();

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
      bottom: () => {
        dispatch(
          moveCard({
            cardInstanceId,
            fromStackId: stackId,
            toStackId: rightStackId,
            method: MoveCardInstanceMethod.bottomNoChange,
          })
        );
      },
      top: () => {
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
  }, [dispatch, cardInstanceId, stackId, rightStackId]);

  const moveLeft = React.useMemo(() => {
    if (!leftStackId) return undefined;

    return {
      bottom: () => {
        dispatch(
          moveCard({
            cardInstanceId,
            fromStackId: stackId,
            toStackId: leftStackId,
            method: MoveCardInstanceMethod.bottomNoChange,
          })
        );
      },
      top: () => {
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
  }, [dispatch, cardInstanceId, stackId, leftStackId]);

  const handleMoveToBottom = React.useMemo(() => {
    if (!canMoveToBottom) return undefined;

    return () => {
      dispatch(
        moveCard({
          cardInstanceId,
          fromStackId: stackId,
          toStackId: stackId,
          method: MoveCardInstanceMethod.bottomNoChange,
        })
      );
    };
  }, [dispatch, cardInstanceId, stackId, canMoveToBottom]);

  return (
    <CardInstance {...rest}>
      <CardAction
        icon="Fl"
        onPress={handleFlipCard}
        style={StyleSheet.flatten([
          styles.action,
          styles.bottom,
          styles.center,
          {
            marginBottom: -size / 2,
            marginLeft: -size / 2,
          },
        ])}
      />
      {handleMoveToBottom && (
        <CardAction
          icon="B"
          onPress={handleMoveToBottom}
          style={StyleSheet.flatten([
            styles.action,
            styles.top,
            styles.center,
            {
              marginTop: -size / 2,
              marginLeft: -size / 2,
            },
          ])}
        />
      )}
      {moveRight && (
        <View
          style={StyleSheet.flatten([
            styles.action,
            styles.right,
            styles.middle,
            {
              marginRight: -size / 2,
              marginTop: -(size * 2 + sideActionGap) / 2,
            },
          ])}
        >
          <CardAction
            icon="Rt"
            onPress={moveRight.top}
            style={styles.topSideAction}
          />
          <CardAction icon="Rb" onPress={moveRight.bottom} />
        </View>
      )}
      {moveLeft && (
        <View
          style={StyleSheet.flatten([
            styles.action,
            styles.left,
            styles.middle,
            {
              marginLeft: -size / 2,
              marginTop: -(size * 2 + sideActionGap) / 2,
            },
          ])}
        >
          <CardAction
            icon="Lt"
            onPress={moveLeft.top}
            style={styles.topSideAction}
          />
          <CardAction icon="Lb" onPress={moveLeft.bottom} />
        </View>
      )}
    </CardInstance>
  );
}

const styles = StyleSheet.create({
  action: {
    position: "absolute",
  },
  bottom: {
    bottom: 0,
  },
  top: {
    top: 0,
  },
  middle: {
    top: "50%",
  },
  center: {
    left: "50%",
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
  topSideAction: {
    marginBottom: sideActionGap,
  },
});
