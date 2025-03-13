import React from "react";
import { View } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { getContainerStyle, getInnerStyle } from "./card.styles";
import useCard from "./useCard";
import { PhysicalMeasuresProvider } from "@/context/PhysicalMeasures";
import ErrorBoundary from "@/components/ErrorBoundary";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/hook/commonTypes";

export default React.forwardRef<CardRef, CardProps>(function Card(props, ref) {
  const state = useCard(props, ref);

  const animationStyle = useAnimatedStyle<
    Pick<DefaultStyle, "transform" | "opacity">
  >(() => {
    let transform: DefaultStyle["transform"] = [];

    if (state.translateX.value !== null) {
      transform = [...transform, { translateX: state.translateX.value }];
    }

    if (state.translateY.value !== null) {
      transform = [...transform, { translateY: state.translateY.value }];
    }

    if (state.rotate.value !== null) {
      transform = [...transform, { rotate: `${state.rotate.value}deg` }];
    }

    if (state.scaleX.value !== null) {
      transform = [...transform, { scaleX: state.scaleX.value }];
    }

    const style: Pick<DefaultStyle, "transform" | "opacity"> = {};

    if (transform.length > 0) {
      style.transform = transform;
    }

    if (state.opacity.value !== null) {
      style.opacity = state.opacity.value;
    }

    return style;
  });

  const containerStyle = React.useMemo(
    () =>
      getContainerStyle({
        ...state.cardSizes,
        style: props.style,
        zIndex: props.zIndex,
        offsetPosition: props.offsetPosition,
        animationStyle,
      }),
    [
      state.cardSizes,
      props.style,
      props.zIndex,
      props.offsetPosition,
      animationStyle,
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
