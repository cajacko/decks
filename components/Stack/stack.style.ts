import { StyleSheet } from "react-native";
import { PositionStyle, StackDimensions } from "./stack.types";

const cardSizeRatios = {
  poker: { width: 2.5, height: 3.5 },
};

const roundTo1Decimal = (num: number): number => Math.round(num * 10) / 10;

// Define the position styles for the visible cards. We render as many cards as there are styles in
// this array, as they would be rendered on top of each other if we did more. So we don't. If we're
// animating cards we render twice as many so we can see any behind as they animate away.
const getPositionStyles = (cardWidth: number): PositionStyle[] => [
  undefined,
  {
    top: -roundTo1Decimal(cardWidth / 300),
    left: roundTo1Decimal(cardWidth / 150),
    transform: [{ rotate: "0.6deg" }],
  },
  {
    top: roundTo1Decimal(cardWidth / 270),
    left: -roundTo1Decimal(cardWidth / 300),
    transform: [{ rotate: "-1.2deg" }],
  },
  {
    top: roundTo1Decimal(cardWidth / 250),
    left: -roundTo1Decimal(cardWidth / 170),
    transform: [{ rotate: "1.2deg" }],
  },
  {
    top: roundTo1Decimal(cardWidth / 190),
    left: -roundTo1Decimal(cardWidth / 280),
    transform: [{ rotate: "-0.6deg" }],
  },
];

function getExampleStackDimensions(
  props: { stackWidth: number } | { stackHeight: number }
): StackDimensions {
  const buttonSize = Math.min(
    Math.max(
      // Math.round(cardWidth / 3.75),
      // These numbers come from eyeballing the size of the buttons on the screen and what seems reasonable
      "stackWidth" in props
        ? Math.round(props.stackWidth / 4.9)
        : Math.round(props.stackHeight / 6.4),
      // This is our minimum size for making it easy for the users
      60
    ),
    // Never show buttons bigger than this, it looks silly
    100
  );

  // The buttons are the closest things together, so base the space between stacks on them
  const spaceBetweenStacks = Math.round(buttonSize / 4);

  // The padding around the card in a stack, which needs to have room for the action buttons that
  // get absolutely positioned around the card/ stack
  const stackPadding = Math.max(
    // The shuffle/ stack actions are a bit further out than card actions
    Math.round(buttonSize / 1.75),
    // Card actions are half on/ half off the card
    Math.round(buttonSize / 2)
  );

  let stackWidth: number;
  let stackHeight: number;
  let cardHeight: number;
  let cardWidth: number;

  // When adjusting things in one of these statements it's very important to check the logic on the
  // other side
  if ("stackWidth" in props) {
    stackWidth = props.stackWidth;

    cardWidth =
      stackWidth - stackPadding * 2 - Math.round(spaceBetweenStacks / 2);

    cardHeight = Math.round(
      cardWidth * (cardSizeRatios.poker.height / cardSizeRatios.poker.width)
    );

    stackHeight = cardHeight + stackPadding * 2;
  } else {
    stackHeight = props.stackHeight;

    cardHeight = stackHeight - stackPadding * 2;

    cardWidth = Math.round(
      cardHeight * (cardSizeRatios.poker.width / cardSizeRatios.poker.height)
    );

    stackWidth =
      cardWidth + stackPadding * 2 + Math.round(spaceBetweenStacks / 2);
  }

  return {
    buttonSize,
    cardHeight,
    cardWidth,
    positionStyles: getPositionStyles(cardWidth),
    spaceBetweenStacks,
    stackPadding,
    stackHeight,
    stackWidth,
  };
}

const maxStackWidth = 500;
const minStackWidth = 300;
const maxStackHeight = 800;
const minStackHeight = 500;

// Get dimensions at 100% availableWidth or the max width (whichever is smaller)
// if the stack height is bigger than availableHeight or max height
// get the dimensions at 100% availableHeight or max height (whichever is smaller)
// that should always do it I think
export function getStackDimensions(props: {
  availableWidth: number;
  availableHeight: number;
}): StackDimensions {
  let dimensions = getExampleStackDimensions({
    stackWidth: Math.max(
      Math.min(props.availableWidth, maxStackWidth),
      minStackWidth
    ),
  });

  if (
    dimensions.stackHeight <= maxStackHeight &&
    dimensions.stackHeight <= props.availableHeight
  ) {
    return dimensions;
  }

  return getExampleStackDimensions({
    stackHeight: Math.max(
      Math.min(props.availableHeight, maxStackHeight),
      minStackHeight
    ),
  });
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  shuffleButton: {
    position: "absolute",
  },
  card: {
    position: "absolute",
  },
});

export default styles;
