import { StyleSheet, Animated, ViewStyle } from "react-native";
import {
  CardProps,
  AnimatedViewStyle,
  OffsetPosition,
  RequiredRefObject,
  CardSize,
  CardMMDimensions,
  CardSizeProps,
} from "./Card.types";

export function parseCardSize(cardSize: CardSize | CardSizeProps) {
  const height =
    "height" in cardSize
      ? cardSize.height
      : "cardHeight" in cardSize
        ? cardSize.cardHeight
        : cardSize.dpHeight;
  const width =
    "width" in cardSize
      ? cardSize.width
      : "cardWidth" in cardSize
        ? cardSize.cardWidth
        : cardSize.dpWidth;

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
  mm: number,
  dp: number,
  options?: {
    min?: number;
    max?: number;
    roundToNumberOfDecimals?: number;
  },
) {
  const ratio = dp / mm;

  return (cardSizes: CardSizeProps): number => {
    const height = cardSizes.dpHeight;
    const width = cardSizes.dpWidth;

    let value = Math.min(height, width) * ratio;

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
    x: withCardStyleScaling(369, 1, boxShadowConfig),
    y: withCardStyleScaling(369, 1, boxShadowConfig),
    blur: withCardStyleScaling(369, 7, boxShadowConfig),
  },
  borderRadius: (cardDimensions: CardMMDimensions) =>
    withCardStyleScaling(
      cardDimensions.mmWidth,
      cardDimensions.mmBorderRadius,
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
export function getOffsetPositions(cardSize: CardSizeProps): OffsetPosition[] {
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

export function getBorderRadius(cardSizes: CardSizeProps): number {
  return scalingStyles.borderRadius(cardSizes)(cardSizes);
}

export const styles = StyleSheet.create({
  inner: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});

export function getInnerStyle(
  props: CardSizeProps & {
    style?: CardProps["innerStyle"];
  },
): ViewStyle {
  return StyleSheet.flatten<ViewStyle>([
    styles.inner,
    {
      boxShadow: `${scalingStyles.boxShadow.x(props)}px ${scalingStyles.boxShadow.y(props)}px ${scalingStyles.boxShadow.blur(props)}px rgba(0, 0, 0, 0.5)`,
      borderRadius: getBorderRadius(props),
    },
    props.style,
  ]);
}

export function getContainerStyle(
  props: CardSizeProps & {
    style?: CardProps["style"];
    opacity: RequiredRefObject<Animated.Value>;
    translateX: RequiredRefObject<Animated.Value>;
    translateY: RequiredRefObject<Animated.Value>;
    scaleX: RequiredRefObject<Animated.Value>;
    zIndex?: number;
    offsetPosition?: number;
    rotate: RequiredRefObject<Animated.Value>;
  },
): AnimatedViewStyle {
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
    {
      zIndex: props.zIndex,
      width: props.dpWidth,
      height: props.dpHeight,
    },
    animationStyle,
    props.style,
  ]);
}
