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
        isAnimating: state.isAnimating,
        opacity: state.opacity,
        scaleX: state.scaleX,
        translateX: state.translateX,
        translateY: state.translateY,
        width: state.width,
        styleProp: props.style,
      }),
    [
      state.height,
      state.isAnimating,
      state.opacity,
      state.scaleX,
      state.translateX,
      state.translateY,
      state.width,
      props.style,
    ],
  );

  return <Animated.View style={style}>{props.children}</Animated.View>;
});
