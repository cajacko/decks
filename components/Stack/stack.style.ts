import { StyleSheet } from "react-native";
import { StackDimensions } from "./stack.types";
import { getCardSizes } from "@/components/Card/cardSizes";
import { CardSizeProps, CardMMDimensions } from "@/components/Card/Card.types";

function getExampleStackDimensions(
  props: ({ stackWidth: number } | { stackHeight: number }) & {
    cardProportions: CardMMDimensions;
  },
): StackDimensions {
  const buttonSize = Math.min(
    Math.max(
      // Math.round(cardWidth / 3.75),
      // These numbers come from eyeballing the size of the buttons on the screen and what seems reasonable
      "stackWidth" in props
        ? Math.round(props.stackWidth / 4.9)
        : Math.round(props.stackHeight / 6.4),
      // This is our minimum size for making it easy for the users
      60,
    ),
    // Never show buttons bigger than this, it looks silly
    100,
  );

  // The buttons are the closest things together, so base the space between stacks on them
  const spaceBetweenStacks = Math.round(buttonSize / 4);

  // The padding around the card in a stack, which needs to have room for the action buttons that
  // get absolutely positioned around the card/ stack
  const stackPadding = Math.max(
    // The shuffle/ stack actions are a bit further out than card actions
    Math.round(buttonSize / 1.5),
    // Card actions are half on/ half off the card
    Math.round(buttonSize / 2),
  );

  let stackWidth: number;
  let stackHeight: number;
  let cardSizes: CardSizeProps;

  // When adjusting things in one of these statements it's very important to check the logic on the
  // other side
  if ("stackWidth" in props) {
    stackWidth = props.stackWidth;

    const cardWidth =
      stackWidth - stackPadding * 2 - Math.round(spaceBetweenStacks / 2);

    cardSizes = getCardSizes({
      constraints: { width: cardWidth },
      proportions: props.cardProportions,
    });

    stackHeight = cardSizes.dpHeight + stackPadding * 2;
  } else {
    stackHeight = props.stackHeight;

    const cardHeight = stackHeight - stackPadding * 2;

    cardSizes = getCardSizes({
      constraints: { height: cardHeight },
      proportions: props.cardProportions,
    });

    stackWidth =
      cardSizes.dpWidth + stackPadding * 2 + Math.round(spaceBetweenStacks / 2);
  }

  return {
    buttonSize,
    spaceBetweenStacks,
    stackPadding,
    stackHeight,
    stackWidth,
    cardSizes,
  };
}

export const maxStackWidth = 500;
const minStackWidth = 300;
export const maxStackHeight = 800;
const minStackHeight = 500;

// Get dimensions at 100% availableWidth or the max width (whichever is smaller)
// if the stack height is bigger than availableHeight or max height
// get the dimensions at 100% availableHeight or max height (whichever is smaller)
// that should always do it I think
export function getStackDimensions(props: {
  availableWidth: number;
  availableHeight: number;
  cardProportions: CardMMDimensions;
}): StackDimensions {
  let dimensions = getExampleStackDimensions({
    cardProportions: props.cardProportions,
    stackWidth: Math.max(
      Math.min(props.availableWidth, maxStackWidth),
      minStackWidth,
    ),
  });

  if (
    dimensions.stackHeight <= maxStackHeight &&
    dimensions.stackHeight <= props.availableHeight
  ) {
    return dimensions;
  }

  return getExampleStackDimensions({
    cardProportions: props.cardProportions,
    stackHeight: Math.max(
      Math.min(props.availableHeight, maxStackHeight),
      minStackHeight,
    ),
  });
}

export function getShuffleStyle(props: { stackPadding: number }) {
  return StyleSheet.flatten([
    styles.shuffleButton,
    {
      zIndex: 1,
      bottom: -props.stackPadding,
      left: -props.stackPadding,
    },
  ]);
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardInstances: {
    position: "relative",
    zIndex: 1,
  },
  shuffleButton: {
    position: "absolute",
  },
  card: {
    position: "absolute",
  },
  empty: {
    position: "absolute",
    zIndex: 0,
  },
});

export default styles;
