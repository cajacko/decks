import React from "react";
import { StyleSheet, View } from "react-native";
import CardInstance from "@/components/CardInstance";
import CardAction, { size } from "@/components/CardAction";
import { StackTopCardProps } from "./types";
import useDispatchActions from "./useDispatchActions";

export * from "./types";

const sideActionGap = size / 4;

export default function StackTopCard(
  props: StackTopCardProps
): React.ReactNode {
  const state = useDispatchActions(props);

  return (
    <CardInstance
      {...props}
      ref={state.cardRef}
      onAnimationChange={state.setIsAnimating}
    >
      {state.showActions && (
        <>
          <CardAction
            icon="Fl"
            onPress={state.handleFlipCard}
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
          {state.handleMoveToBottom && (
            <CardAction
              icon="B"
              onPress={state.handleMoveToBottom}
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
          {state.moveRight && (
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
                onPress={state.moveRight.top}
                style={styles.topSideAction}
              />
              <CardAction icon="Rb" onPress={state.moveRight.bottom} />
            </View>
          )}
          {state.moveLeft && (
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
                onPress={state.moveLeft.top}
                style={styles.topSideAction}
              />
              <CardAction icon="Lb" onPress={state.moveLeft.bottom} />
            </View>
          )}
        </>
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
