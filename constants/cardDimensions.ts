import { CardMMDimensions } from "@/components/Card/Card.types";
import { Cards } from "@/store/types";

const cardDimensions = {
  [Cards.Size.Poker]: {
    mmBorderRadius: 3.5,
    mmHeight: 88.9,
    mmWidth: 63.5,
  },
} satisfies Record<Cards.Size, CardMMDimensions>;

export const defaultCardDimensions = cardDimensions[Cards.Size.Poker];

export default cardDimensions;
