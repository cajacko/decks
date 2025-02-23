interface CardDimensions {
  mm: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

const cardDimensions = {
  poker: {
    mm: {
      width: 63.5,
      height: 88.9,
      borderRadius: 3.5,
    },
  },
} satisfies Record<string, CardDimensions>;

export type CardTypes = keyof typeof cardDimensions;

export default cardDimensions;
