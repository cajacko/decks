import { CardMMDimensions } from "@/components/Card/Card.types";
import { Decks } from "@/store/types";

const cardDimensions = {
  [Decks.CardSize.Poker]: {
    mmBorderRadius: 3.5,
    mmHeight: 88.9,
    mmWidth: 63.5,
  },
} satisfies Record<Decks.CardSize, CardMMDimensions>;

export const defaultCardDimensions = cardDimensions[Decks.CardSize.Poker];

export default cardDimensions;
