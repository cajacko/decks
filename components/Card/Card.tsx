import React from "react";
import { Animated, View } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { getContainerStyle, getInnerStyle } from "./card.styles";
import useCard from "./useCard";
import { PhysicalMeasuresProvider } from "@/context/PhysicalMeasures";
import cardDimensions from "@/config/cardDimensions";
import ErrorBoundary from "@/components/ErrorBoundary";

export default React.forwardRef<CardRef, CardProps>(function Card(props, ref) {
  const state = useCard(props, ref);

  const containerStyle = React.useMemo(
    () =>
      getContainerStyle({
        height: state.height,
        opacity: state.opacity,
        scaleX: state.scaleX,
        translateX: state.translateX,
        translateY: state.translateY,
        width: state.width,
        style: props.style,
        zIndex: props.zIndex,
        offsetPosition: props.offsetPosition,
        rotate: state.rotate,
      }),
    [
      state.height,
      state.opacity,
      state.scaleX,
      state.translateX,
      state.translateY,
      state.width,
      props.style,
      props.zIndex,
      props.offsetPosition,
      state.rotate,
    ],
  );

  const innerStyle = React.useMemo(
    () =>
      getInnerStyle({
        height: state.height,
        width: state.width,
        style: props.innerStyle,
      }),
    [state.height, state.width, props.innerStyle],
  );

  return (
    <PhysicalMeasuresProvider
      mmDistance={cardDimensions.poker.mm.width}
      dpDistance={state.width}
    >
      <Animated.View style={containerStyle}>
        <View style={innerStyle}>
          <ErrorBoundary logLevel="error">{props.children}</ErrorBoundary>
        </View>
        {props.overlay}
      </Animated.View>
    </PhysicalMeasuresProvider>
  );
});
