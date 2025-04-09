import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  StyleProps,
} from "react-native-reanimated";
import EmptyStack from "@/components/stacks/EmptyStack";
import CardSpacer from "@/components/cards/connected/CardSpacer";
import CardSpacerSkeleton from "@/components/cards/connected/CardSpacerSkeleton";
import { StackProps } from "./stack.types";
import styles, { getToolbarContainerStyle } from "./stack.style";
import useStack, { useStackWidth } from "./useStack";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import StackListItem, {
  StackListItemSkeleton,
} from "@/components/stacks/StackListItem";
import { Target } from "@/utils/cardTarget";
import StackToolbar from "@/components/stacks/StackToolbar";
import useGetStackName from "@/hooks/useGetStackName";

function StackContent(
  props: Pick<StackProps, "style"> & {
    emptyStack?: React.ReactNode;
    cards?: React.ReactNode;
    cardSpacer: React.ReactNode;
    containerStyle?: StyleProps;
    innerStyle?: StyleProps;
    toolbar?: React.ReactNode;
  },
) {
  const dimensions = useTabletopContext();

  const innerStyle = React.useMemo(
    () => [
      styles.inner,
      {
        paddingVertical: dimensions.stackVerticalPadding,
        paddingHorizontal: dimensions.stackHorizontalPadding,
      },
      props.innerStyle,
    ],
    [
      props.innerStyle,
      dimensions.stackVerticalPadding,
      dimensions.stackHorizontalPadding,
    ],
  );

  const containerStyle = React.useMemo(
    () => [props.containerStyle, styles.container, props.style],
    [props.style, props.containerStyle],
  );

  const toolbarContainerStyle = React.useMemo(
    () =>
      getToolbarContainerStyle({
        stackHorizontalPadding: dimensions.stackHorizontalPadding,
      }),
    [dimensions.stackHorizontalPadding],
  );

  const positionStyles = React.useMemo(
    () => ({
      above: StyleSheet.flatten([
        styles.position,
        {
          top: 0,
          height: dimensions.aboveStackHeight,
        },
      ]),
      below: StyleSheet.flatten([
        styles.position,
        {
          bottom: 0,
          height: dimensions.belowStackHeight,
        },
      ]),
    }),
    [dimensions.belowStackHeight, dimensions.aboveStackHeight],
  );

  return (
    <Animated.View style={containerStyle}>
      <View style={positionStyles.above}>
        <View style={toolbarContainerStyle}>{props.toolbar}</View>
      </View>
      <Animated.View style={innerStyle}>
        <View style={{ position: "relative" }}>
          {props.cards && (
            <View style={styles.cardInstances}>{props.cards}</View>
          )}
          {props.emptyStack}
          {props.cardSpacer}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export function StackSkeleton(
  props: Pick<StackProps, "style">,
): React.ReactNode {
  const cards = React.useMemo(
    () => [<StackListItemSkeleton key="stack-1" zIndex={1} />],
    [],
  );
  const width = useStackWidth();

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <StackContent
      cardSpacer={<CardSpacerSkeleton />}
      cards={cards}
      style={props.style}
      containerStyle={containerStyle}
    />
  );
}

export default function Stack(props: StackProps): React.ReactNode {
  const { deckId, tabletopId } = useTabletopContext();
  const stackName = useGetStackName(tabletopId)(props.stackId);

  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  const {
    cardInstancesIds,
    getCardOffsetPosition,
    handleShuffle,
    rotation,
    width,
    opacity,
    emptyStackButton,
    handleFlipAll,
  } = useStack(props);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
  }));

  function getShouldShowShuffle(): boolean {
    if (!cardInstances) return false;
    if (cardInstances.length <= 0) return false;

    return true;
  }

  const cardInstances = React.useMemo(() => {
    if (!cardInstancesIds || cardInstancesIds.length === 0) return null;

    return cardInstancesIds.map((cardInstanceId, i) => (
      <StackListItem
        key={cardInstanceId}
        cardInstanceId={cardInstanceId}
        isTopCard={i === 0}
        cardOffsetPosition={getCardOffsetPosition(cardInstanceId)}
        zIndex={cardInstancesIds.length - i + 1}
        stackId={props.stackId}
        leftStackId={props.leftStackId}
        rightStackId={props.rightStackId}
        stackListRef={props.stackListRef}
      />
    ));
  }, [
    props.stackId,
    props.leftStackId,
    props.rightStackId,
    cardInstancesIds,
    getCardOffsetPosition,
    props.stackListRef,
  ]);

  return (
    <StackContent
      style={props.style}
      emptyStack={
        <EmptyStack
          style={styles.empty}
          buttonTitle={emptyStackButton?.title}
          buttonAction={emptyStackButton?.action}
        />
      }
      cardSpacer={<CardSpacer target={target} />}
      cards={cardInstances}
      containerStyle={containerStyle}
      innerStyle={innerStyle}
      toolbar={
        <StackToolbar
          title={stackName}
          handleShuffle={getShouldShowShuffle() ? handleShuffle : undefined}
          handleFlipAll={handleFlipAll}
        />
      }
    />
  );
}
