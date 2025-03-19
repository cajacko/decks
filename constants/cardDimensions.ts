import { Cards } from "@/store/types";

export interface CardPhysicalSize {
  mmHeight: number;
  mmWidth: number;
  mmBorderRadius: number;
}

const cardDimensions = {
  [Cards.Size.Poker]: {
    mmBorderRadius: 3.5,
    mmHeight: 88.9,
    mmWidth: 63.5,
  },
} satisfies Record<Cards.Size, CardPhysicalSize>;

export const defaultCardSize = Cards.Size.Poker;

export const defaultCardDimensions = cardDimensions[defaultCardSize];

export default cardDimensions;
