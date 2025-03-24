import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { StackDimensions } from "./stack.types";
import { CardPhysicalSize } from "../../cards/context/CardPhysicalSize";
import { Scale } from "../../cards/context/PhysicalMeasures";

function getSizesFromWidth(dpWidth: number, physicalSize: CardPhysicalSize) {
  const { mmHeight, mmWidth } = physicalSize;
  const dpHeight = (mmHeight / mmWidth) * dpWidth;

  return {
    dpHeight,
    dpWidth,
    mmHeight,
    mmWidth,
  };
}

function getSizesFromHeight(dpHeight: number, physicalSize: CardPhysicalSize) {
  const { mmHeight, mmWidth } = physicalSize;
  const dpWidth = (mmWidth / mmHeight) * dpHeight;

  return {
    dpHeight,
    dpWidth,
    mmHeight,
    mmWidth,
  };
}

function getExampleStackDimensions(
  props: ({ stackWidth: number } | { stackHeight: number }) & {
    physicalSize: CardPhysicalSize;
  },
): Omit<StackDimensions, "canOnlyFit1Stack"> {
  const buttonSize = Math.min(
    Math.max(
      // Math.round(cardWidth / 3.75),
      // These numbers come from eyeballing the size of the buttons on the screen and what seems reasonable
      "stackWidth" in props
        ? Math.round(props.stackWidth / 4.9)
        : Math.round(props.stackHeight / 6.4),
      // This is our minimum size for making it easy for the users
      40,
    ),
    // Never show buttons bigger than this, it looks silly
    80,
  );

  // The buttons are the closest things together, so base the space between stacks on them
  const spaceBetweenStacks = Math.round(buttonSize / 4);

  // The padding around the card in a stack, which needs to have room for the action buttons that
  // get absolutely positioned around the card/ stack
  // Card actions are half on/ half off the card
  const stackHorizontalPadding = Math.round(buttonSize / 2);
  // The shuffle/ stack actions are a bit further out than card actions (but only vertically)
  // Must be more than 1 to allow the shuffle button to be there
  const stackVerticalPadding = Math.round(buttonSize * 1.25);

  let stackWidth: number;
  let stackHeight: number;
  let scale: Scale;

  // When adjusting things in one of these statements it's very important to check the logic on the
  // other side
  if ("stackWidth" in props) {
    stackWidth = props.stackWidth;

    const cardWidth =
      stackWidth -
      stackHorizontalPadding * 2 -
      Math.round(spaceBetweenStacks / 2);

    scale = { dpDistance: cardWidth, mmDistance: props.physicalSize.mmWidth };

    const cardHeight = getSizesFromWidth(
      cardWidth,
      props.physicalSize,
    ).dpHeight;

    stackHeight = cardHeight + stackVerticalPadding * 2;
  } else {
    stackHeight = props.stackHeight;

    const cardHeight = stackHeight - stackVerticalPadding * 2;
    scale = { dpDistance: cardHeight, mmDistance: props.physicalSize.mmHeight };

    const cardWidth = getSizesFromHeight(
      cardHeight,
      props.physicalSize,
    ).dpWidth;

    stackWidth =
      cardWidth +
      stackHorizontalPadding * 2 +
      Math.round(spaceBetweenStacks / 2);
  }

  return {
    buttonSize,
    spaceBetweenStacks,
    stackHorizontalPadding,
    stackVerticalPadding,
    stackHeight,
    stackWidth,
    scale,
  };
}

function getCanOnlyFit1Stack({
  availableWidth,
  stackWidth,
}: {
  stackWidth: number;
  availableWidth: number;
}): boolean {
  return availableWidth / stackWidth < 2;
}

const maxStackHeight = 700;
const maxStackWidth = maxStackHeight;
const minStackHeight = 300;
const minStackWidth = minStackHeight;

// Get dimensions at 100% availableWidth or the max width (whichever is smaller)
// if the stack height is bigger than availableHeight or max height
// get the dimensions at 100% availableHeight or max height (whichever is smaller)
// that should always do it I think
export function getStackDimensions(props: {
  availableWidth: number;
  availableHeight: number;
  physicalSize: CardPhysicalSize;
}): StackDimensions {
  let dimensions = getExampleStackDimensions({
    physicalSize: props.physicalSize,
    stackWidth: Math.max(
      Math.min(props.availableWidth, maxStackWidth),
      minStackWidth,
    ),
  });

  if (
    dimensions.stackHeight <= maxStackHeight &&
    dimensions.stackHeight <= props.availableHeight
  ) {
    return {
      ...dimensions,
      canOnlyFit1Stack: getCanOnlyFit1Stack({
        availableWidth: props.availableWidth,
        stackWidth: dimensions.stackWidth,
      }),
    };
  }

  dimensions = getExampleStackDimensions({
    physicalSize: props.physicalSize,
    stackHeight: Math.max(
      Math.min(props.availableHeight, maxStackHeight),
      minStackHeight,
    ),
  });

  return {
    ...dimensions,
    canOnlyFit1Stack: getCanOnlyFit1Stack({
      availableWidth: props.availableWidth,
      stackWidth: dimensions.stackWidth,
    }),
  };
}

export function getShuffleStyle(props: {
  buttonSize: number;
}): StyleProp<ViewStyle> {
  return StyleSheet.flatten([
    styles.shuffleContainer,
    {
      zIndex: 1,
      alignItems: "center",
    },
  ]);
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  inner: {
    zIndex: 2,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInstances: {
    position: "relative",
    zIndex: 1,
  },
  shuffleContainer: {
    opacity: 0.5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  shuffleButton: {},
  card: {
    position: "absolute",
  },
  empty: {
    position: "absolute",
    zIndex: 0,
  },
});

export default styles;
