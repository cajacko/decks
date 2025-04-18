import React from "react";
import UIAnimatedCardSides, {
  AnimatedCardSidesRef,
  AnimatedCardSidesProps as UIAnimatedCardSidesProps,
} from "@/components/cards/ui/AnimatedCardSides";
import { useEditCardProps } from "@/components/cards/connected/EditingCard";
import { AnimatedCardProps } from "@/components/cards/connected/AnimatedCard";
import { Cards } from "@/store/types";

export { AnimatedCardSidesRef };

export interface EditingAnimatedCardSidesProps
  extends Omit<UIAnimatedCardSidesProps, Cards.Side>,
    Omit<AnimatedCardProps, "side" | "style"> {
  cardStyle?: AnimatedCardProps["style"];
}

export default React.forwardRef<
  AnimatedCardSidesRef,
  EditingAnimatedCardSidesProps
>(function EditingAnimatedCardSides({ side, style, cardStyle, ...props }, ref) {
  const front = useEditCardProps({
    ...props,
    style: cardStyle,
    side: "front",
  });
  const back = useEditCardProps({ ...props, style: cardStyle, side: "back" });

  return (
    <UIAnimatedCardSides
      ref={ref}
      side={side}
      back={back}
      front={front}
      style={style}
    />
  );
});
