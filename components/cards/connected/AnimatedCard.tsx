import React from "react";
import UIAnimatedCard, {
  AnimatedCardRef,
  AnimatedCardProps as UIAnimatedCardProps,
} from "@/components/cards/ui/AnimatedCard";
import { useCardProps, CardProps } from "@/components/cards/connected/Card";

export { AnimatedCardRef };

export type AnimatedCardProps = CardProps &
  Partial<Exclude<UIAnimatedCardProps, CardProps>>;

export default React.forwardRef<AnimatedCardRef, AnimatedCardProps>(
  function AnimatedCard(props, ref) {
    const cardProps = useCardProps(props);

    return <UIAnimatedCard ref={ref} {...cardProps} />;
  },
);
