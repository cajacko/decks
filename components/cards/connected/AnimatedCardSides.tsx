import React from "react";
import UIAnimatedCardSides, {
  AnimatedCardSidesRef,
  AnimatedCardSidesProps as UIAnimatedCardSidesProps,
} from "@/components/cards/ui/AnimatedCardSides";
import { useCardProps } from "@/components/cards/connected/Card";
import { AnimatedCardProps } from "@/components/cards/connected/AnimatedCard";
import { Cards } from "@/store/types";

export { AnimatedCardSidesRef };

export interface AnimatedCardSidesProps
  extends Omit<UIAnimatedCardSidesProps, Cards.Side>,
    Omit<AnimatedCardProps, "side" | "style"> {
  cardStyle?: AnimatedCardProps["style"];
}

export default React.forwardRef<AnimatedCardSidesRef, AnimatedCardSidesProps>(
  function AnimatedCardSides(
    { side, style, cardStyle, animatedStyle, ...props },
    ref,
  ) {
    const front = useCardProps({ ...props, style: cardStyle, side: "front" });
    const back = useCardProps({ ...props, style: cardStyle, side: "back" });

    return (
      <UIAnimatedCardSides
        ref={ref}
        side={side}
        back={back}
        front={front}
        style={style}
        animatedStyle={animatedStyle}
      />
    );
  },
);
