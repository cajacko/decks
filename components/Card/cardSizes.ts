import AppError from "@/classes/AppError";
import { defaultCardDimensions } from "@/constants/cardDimensions";
import {
  CardSizeProps,
  CardSizeContextProps,
  CardMMDimensions,
} from "./Card.types";

export const defaultCardDpWidth = 400;
export { defaultCardDimensions };

export function getSizesFromWidth(
  width: number,
  proportions: CardMMDimensions,
): CardSizeProps {
  const { mmHeight, mmWidth, mmBorderRadius } = proportions;
  const dpHeight = (mmHeight / mmWidth) * width;
  const dpBorderRadius = (mmBorderRadius / mmWidth) * width;

  return {
    dpHeight,
    dpWidth: width,
    mmHeight,
    mmWidth,
    dpBorderRadius,
    mmBorderRadius,
  };
}

export function getSizesFromHeight(
  height: number,
  proportions: CardMMDimensions,
): CardSizeProps {
  const { mmHeight, mmWidth, mmBorderRadius } = proportions;
  const dpWidth = (mmWidth / mmHeight) * height;
  const dpBorderRadius = (mmBorderRadius / mmHeight) * height;

  return {
    dpHeight: height,
    dpWidth,
    mmHeight,
    mmWidth,
    dpBorderRadius,
    mmBorderRadius,
  };
}

export function getCardSizes(props: CardSizeContextProps): CardSizeProps {
  const { proportions, constraints } = props;
  const { height, maxHeight, maxWidth, width } = constraints;

  if (width) {
    return getSizesFromWidth(width, proportions);
  }

  if (height) {
    return getSizesFromHeight(height, proportions);
  }

  // Maintain aspect ratio from mmHeight and mmWidth. So
  if (maxHeight && maxWidth) {
    const sizesFromHeight = getSizesFromHeight(maxHeight, proportions);

    if (sizesFromHeight.dpWidth <= maxWidth) {
      return sizesFromHeight;
    }

    return getSizesFromWidth(maxWidth, proportions);
  }

  if (maxHeight) {
    return getSizesFromHeight(maxHeight, proportions);
  }

  if (maxWidth) {
    return getSizesFromWidth(maxWidth, proportions);
  }

  new AppError(
    `${getCardSizes.name} could not determine card size from constraints, showing an incorrect card size`,
    props,
  ).log("error");

  // Some kind of reasonable default, but this should never happen
  return getSizesFromWidth(defaultCardDpWidth, proportions);
}
