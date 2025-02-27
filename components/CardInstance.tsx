import React from "react";
import CardSides, {
  CardSidesRef,
  CardSidesProps,
} from "@/components/CardSides";
import { selectCardInstance } from "@/store/slices/tabletop";
import { useRequiredAppSelector } from "@/store/hooks";
import { useTabletopContext } from "@/components/Tabletop/Tabletop.context";

export interface CardInstanceProps extends Partial<CardSidesProps> {
  cardInstanceId: string;
}

export default React.forwardRef<CardSidesRef, CardInstanceProps>(
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

    return (
      <CardSides
        ref={ref}
        side={cardInstance.side}
        id={cardInstance.cardId}
        type="card"
        {...cardSidesProps}
      />
    );
  },
);
