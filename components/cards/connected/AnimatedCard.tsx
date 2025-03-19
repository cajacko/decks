import React from "react";
import UIAnimatedCard, {
  AnimatedCardRef,
  AnimatedCardProps as UIAnimatedCardProps,
} from "@/components/cards/ui/AnimatedCard";
import { CardPhysicalSizeProvider } from "../context/CardPhysicalSize";
import { useCardProps, CardProps } from "@/components/cards/connected/Card";

export { AnimatedCardRef };

export type AnimatedCardProps = CardProps &
  Partial<Exclude<UIAnimatedCardProps, CardProps>>;

export default React.forwardRef<AnimatedCardRef, AnimatedCardProps>(
  function AnimatedCard(props, ref) {
    const cardProps = useCardProps(props);

    return (
      <CardPhysicalSizeProvider
        debugLocation={AnimatedCard.name}
        target={props.target}
      >
        <UIAnimatedCard ref={ref} {...cardProps} />
      </CardPhysicalSizeProvider>
    );
  },
);
