import React from "react";
import { Animated, View } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { getContainerStyle, getInnerStyle } from "./card.styles";
import useCard from "./useCard";
import { PhysicalMeasuresProvider } from "@/context/PhysicalMeasures";
import ErrorBoundary from "@/components/ErrorBoundary";

export default React.forwardRef<CardRef, CardProps>(function Card(props, ref) {
  const state = useCard(props, ref);

  const containerStyle = React.useMemo(
    () =>
      getContainerStyle({
        ...state.cardSizes,
        opacity: state.opacity,
        scaleX: state.scaleX,
        translateX: state.translateX,
        translateY: state.translateY,
        style: props.style,
        zIndex: props.zIndex,
        offsetPosition: props.offsetPosition,
        rotate: state.rotate,
      }),
    [
      state.cardSizes,
      state.opacity,
      state.scaleX,
      state.translateX,
      state.translateY,
      props.style,
      props.zIndex,
      props.offsetPosition,
      state.rotate,
    ],
  );

  const innerStyle = React.useMemo(
    () =>
      getInnerStyle({
        ...state.cardSizes,
        style: props.innerStyle,
      }),
    [state.cardSizes, props.innerStyle],
  );

  return (
    <PhysicalMeasuresProvider
      mmDistance={state.cardSizes.mmWidth}
      dpDistance={state.cardSizes.dpWidth}
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
