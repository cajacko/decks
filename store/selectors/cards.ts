import { RootState, Cards } from "../types";
import { Target } from "@/utils/cardTarget";
import withBuiltInState from "../utils/withBuiltInState";

export type CardIdProps = { cardId: Cards.Id };
export type DeckOrCardOptionalSideProps = Target & { side?: Cards.Side };

export const selectCard = withBuiltInState(
  (state: RootState, props: CardIdProps): Cards.Props | undefined =>
    state.cards.cardsById[props.cardId],
);

export const cardOrDeckKey = (
  _: unknown,
  props: DeckOrCardOptionalSideProps,
): string => `${props.type}:${props.id}-${props.side}`;
