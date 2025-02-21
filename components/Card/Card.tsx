import React from "react";
import { Animated } from "react-native";
import { CardProps, CardRef } from "./Card.types";
import { getCardStyle } from "./card.styles";
import useCard from "./useCard";

export default React.forwardRef<CardRef, CardProps>(function Card(props, ref) {
  const state = useCard(props, ref);

  const style = React.useMemo(
    () =>
      getCardStyle({
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

  return <Animated.View style={style}>{props.children}</Animated.View>;
});
