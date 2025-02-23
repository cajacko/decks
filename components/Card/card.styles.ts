import { StyleSheet, Animated } from "react-native";
import {
  CardProps,
  AnimatedViewStyle,
  OffsetPosition,
  RequiredRefObject,
  CardSize,
} from "./Card.types";
import cardDimensions from "@/config/cardDimensions";

export function parseCardSize(cardSize: CardSize) {
  const height = "height" in cardSize ? cardSize.height : cardSize.cardHeight;
  const width = "width" in cardSize ? cardSize.width : cardSize.cardWidth;

  return {
    height,
    width,
    area: height * width,
  };
}

/**
 * Define a style value that looks right on a square card of a given size. Our returned function
 * then scales this value based on the area of the actual card.
 */
export function withCardStyleScaling(
  /**
   * Either the length of a side of the square card, or an object with height and width properties.
   */
  referenceCardSize: number | CardSize,
  /**
   * The desired value for the reference card size.
   */
  referenceValue: number,
  options?: {
    min?: number;
    max?: number;
    roundToNumberOfDecimals?: number;
    scaleOff?: "shortest-side" | "longest-side" | "area";
  },
) {
  const scaleOff = options?.scaleOff ?? "shortest-side";

  const referenceCard =
    typeof referenceCardSize === "number"
      ? {
          height: referenceCardSize,
          width: referenceCardSize,
          area: referenceCardSize ** 2,
        }
      : parseCardSize(referenceCardSize);

  const areaRatio = referenceValue / referenceCard.area;
  const shortestSideRatio =
    referenceValue / Math.min(referenceCard.height, referenceCard.width);
  const longestSideRatio =
    referenceValue / Math.max(referenceCard.height, referenceCard.width);

  return (cardSize: CardSize): number => {
    const { area, height, width } = parseCardSize(cardSize);

    let value: number;

    switch (scaleOff) {
      case "area":
        value = area * areaRatio;
        break;
      case "shortest-side":
        value = Math.min(height, width) * shortestSideRatio;
        break;
      case "longest-side":
        value = Math.max(height, width) * longestSideRatio;
        break;
    }

    if (options?.roundToNumberOfDecimals) {
      value =
        Math.round(value * 10 ** options.roundToNumberOfDecimals) /
        10 ** options.roundToNumberOfDecimals;
    }

    if (options?.min) {
      value = Math.max(value, options.min);
    }

    if (options?.max) {
      value = Math.min(value, options.max);
    }

    return value;
  };
}

const offsetConfig = {
  min: 1,
  roundToNumberOfDecimals: 1,
};

const boxShadowConfig = {
  min: 1,
  roundToNumberOfDecimals: 1,
};

const offsetSpread = 3;

const scalingStyles = {
  borderWidth: withCardStyleScaling(371, 2, {
    min: 1,
    roundToNumberOfDecimals: 0,
  }),
  boxShadow: {
    x: withCardStyleScaling(369, 2, boxShadowConfig),
    y: withCardStyleScaling(369, 2, boxShadowConfig),
    blur: withCardStyleScaling(369, 3, boxShadowConfig),
  },
  borderRadius: withCardStyleScaling(
    cardDimensions.poker.mm.width,
    cardDimensions.poker.mm.borderRadius,
    {
      min: 0,
      roundToNumberOfDecimals: 0,
    },
  ),
  offsetPositions: {
    1: {
      x: withCardStyleScaling(369, offsetSpread * 1, offsetConfig),
      y: withCardStyleScaling(369, offsetSpread * 2, offsetConfig),
    },
    2: {
      x: withCardStyleScaling(369, offsetSpread * 1.5, offsetConfig),
      y: withCardStyleScaling(369, offsetSpread * 1, offsetConfig),
    },
    3: {
      x: withCardStyleScaling(369, offsetSpread * 2, offsetConfig),
      y: withCardStyleScaling(369, offsetSpread * 2.2, offsetConfig),
    },
    4: {
      x: withCardStyleScaling(369, offsetSpread * 1.8, offsetConfig),
      y: withCardStyleScaling(369, offsetSpread * 1.5, offsetConfig),
    },
  },
};

/**
 * Define the minimum amount needed for a stack to look good, so we're not rendering loads of cards
 * in stack.
 */
export function getOffsetPositions(cardSize: CardSize): OffsetPosition[] {
  return [
    {
      rotate: 0,
      x: 0,
      y: 0,
    },
    {
      y: -scalingStyles.offsetPositions[1].y(cardSize),
      x: scalingStyles.offsetPositions[1].x(cardSize),
      rotate: 0.6,
    },
    {
      y: scalingStyles.offsetPositions[2].y(cardSize),
      x: -scalingStyles.offsetPositions[2].x(cardSize),
      rotate: -1.2,
    },
    {
      y: -scalingStyles.offsetPositions[3].y(cardSize),
      x: scalingStyles.offsetPositions[3].x(cardSize),
      rotate: 1.2,
    },
    {
      y: scalingStyles.offsetPositions[4].y(cardSize),
      x: -scalingStyles.offsetPositions[4].x(cardSize),
      rotate: -0.6,
    },
  ];
}

export function getBorderRadius(cardSize: CardSize): number {
  return scalingStyles.borderRadius(cardSize);
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#ebebeb",
  },
});

export function getCardStyle(props: {
  style?: CardProps["style"];
  width: number;
  height: number;
  opacity: RequiredRefObject<Animated.Value>;
  translateX: RequiredRefObject<Animated.Value>;
  translateY: RequiredRefObject<Animated.Value>;
  scaleX: RequiredRefObject<Animated.Value>;
  zIndex?: number;
  offsetPosition?: number;
  rotate: RequiredRefObject<Animated.Value>;
}): AnimatedViewStyle {
  const rotate = props.rotate.current.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const animationStyle: AnimatedViewStyle = {
    transform: [
      { translateX: props.translateX.current },
      { translateY: props.translateY.current },
      { scaleX: props.scaleX.current },
      { rotate },
    ],
    opacity: props.opacity.current,
  };

  return StyleSheet.flatten<AnimatedViewStyle>([
    styles.container,
    {
      borderWidth: scalingStyles.borderWidth(props),
      boxShadow: `${scalingStyles.boxShadow.x(props)}px ${scalingStyles.boxShadow.y(props)}px ${scalingStyles.boxShadow.blur(props)}px rgba(0, 0, 0, 0.2)`,
      zIndex: props.zIndex,
      width: props.width,
      height: props.height,
      borderRadius: getBorderRadius(props),
    },
    animationStyle,
    props.style,
  ]);
}
