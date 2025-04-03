import React from "react";
import AnimatedCardSides, {
  AnimatedCardSidesRef,
  AnimatedCardSidesProps,
} from "@/components/cards/connected/AnimatedCardSides";
import { selectCardInstance } from "@/store/slices/tabletop";
import { useRequiredAppSelector } from "@/store/hooks";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import { Target } from "@/utils/cardTarget";
import CardSkeleton from "./CardSkeleton";

export interface CardInstanceProps extends Partial<AnimatedCardSidesProps> {
  cardInstanceId: string;
}

export function CardInstanceSkeleton({
  style,
}: Pick<CardInstanceProps, "style">) {
  return <CardSkeleton style={style} />;
}

export default React.forwardRef<AnimatedCardSidesRef, CardInstanceProps>(
  function CardInstance({ cardInstanceId, ...cardSidesProps }, ref) {
    const { tabletopId } = useTabletopContext();

    const cardInstance = useRequiredAppSelector(
      (state) =>
        selectCardInstance(state, {
          cardInstanceId: cardInstanceId,
          tabletopId,
        }),
      selectCardInstance.name,
    );

    const target = React.useMemo(
      (): Target => ({
        id: cardInstance.cardId,
        type: "card",
      }),
      [cardInstance.cardId],
    );

    return (
      <AnimatedCardSides
        ref={ref}
        side={cardInstance.side}
        target={target}
        {...cardSidesProps}
      />
    );
  },
);
