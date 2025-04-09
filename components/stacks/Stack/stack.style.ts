import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { StackDimensions } from "./stack.types";
import { CardPhysicalSize } from "../../cards/context/CardPhysicalSize";
import { Scale } from "../../cards/context/PhysicalMeasures";
import { stackToolbarHeight } from "../StackToolbar";
import { stackListIndicatorsHeight } from "../StackListIndicators";
import { cardActionSize } from "@/components/forms/CardAction";

export const tabletopUISpacing = 20;
const maxCardHeight = 600;

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

function getExampleStackDimensions(props: {
  availableWidth: number;
  availableHeight: number;
  baseOff: "height" | "width";
  physicalSize: CardPhysicalSize;
}): Omit<StackDimensions, "canOnlyFit1Stack"> {
  // The buttons are the closest things together, so base the space between stacks on them
  const spaceBetweenStacks = Math.round(cardActionSize / 4);

  // The padding around the card in a stack, which needs to have room for the action buttons that
  // get absolutely positioned around the card/ stack
  // Card actions are half on/ half off the card
  const buttonOverlaySize = Math.round(cardActionSize / 2);
  const stackHorizontalPadding = buttonOverlaySize;
  const stackVerticalPadding = buttonOverlaySize;

  const minSpaceAboveStack = stackToolbarHeight + tabletopUISpacing * 2;
  const minSpaceBelowStack = stackListIndicatorsHeight + tabletopUISpacing * 2;
  const minVerticalSpacing = Math.max(minSpaceAboveStack, minSpaceBelowStack);

  let stackContainerWidth: number;
  let stackContainerHeight: number;
  let stackWidth: number;
  let stackHeight: number;
  let scale: Scale;
  let cardHeight: number;
  let cardWidth: number;

  // When adjusting things in one of these statements it's very important to check the logic on the
  // other side
  if (props.baseOff === "width") {
    stackContainerWidth = props.availableWidth;
    stackWidth = stackContainerWidth;

    cardWidth =
      stackWidth -
      stackHorizontalPadding * 2 -
      Math.round(spaceBetweenStacks / 2);

    scale = { dpDistance: cardWidth, mmDistance: props.physicalSize.mmWidth };
    cardHeight = getSizesFromWidth(cardWidth, props.physicalSize).dpHeight;
    stackHeight = cardHeight + stackVerticalPadding * 2;

    stackContainerHeight = Math.max(
      stackHeight + minVerticalSpacing * 2,
      props.availableHeight,
    );
  } else {
    stackContainerHeight = props.availableHeight;
    stackHeight = stackContainerHeight - minVerticalSpacing * 2;

    cardHeight = stackHeight - stackVerticalPadding * 2;
    scale = { dpDistance: cardHeight, mmDistance: props.physicalSize.mmHeight };

    cardWidth = getSizesFromHeight(cardHeight, props.physicalSize).dpWidth;

    stackWidth =
      cardWidth +
      stackHorizontalPadding * 2 +
      Math.round(spaceBetweenStacks / 2);

    stackContainerWidth = Math.max(stackWidth, props.availableWidth);
  }

  const aboveBelowHeight = (props.availableHeight - stackHeight) / 2;

  return {
    spaceBetweenStacks,
    stackHorizontalPadding,
    stackVerticalPadding,
    stackHeight,
    stackWidth,
    scale,
    cardHeight,
    cardWidth,
    aboveStackHeight: aboveBelowHeight,
    belowStackHeight: aboveBelowHeight,
    stackContainerWidth,
    stackContainerHeight,
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
    ...props,
    baseOff: "width",
    // stackWidth: Math.max(
    //   Math.min(props.availableWidth, maxStackWidth),
    //   minStackWidth,
    // ),
  });

  if (
    dimensions.cardHeight <= maxCardHeight &&
    dimensions.stackContainerHeight <= props.availableHeight
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
    ...props,
    baseOff: "height",
    // stackHeight: Math.max(
    //   Math.min(props.availableHeight, maxStackHeight),
    //   minStackHeight,
    // ),
  });

  return {
    ...dimensions,
    canOnlyFit1Stack: getCanOnlyFit1Stack({
      availableWidth: props.availableWidth,
      stackWidth: dimensions.stackWidth,
    }),
  };
}

export function getToolbarContainerStyle(props: {
  stackHorizontalPadding: number;
}): StyleProp<ViewStyle> {
  return StyleSheet.flatten([
    styles.toolbarContainer,
    {
      paddingHorizontal: props.stackHorizontalPadding,
    },
  ]);
}

const styles = StyleSheet.create({
  position: {
    position: "absolute",
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "green",
  },
  container: {
    position: "relative",
    height: "100%",
    justifyContent: "center",
  },
  inner: {
    zIndex: 2,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "red",
  },
  cardInstances: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toolbarContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    position: "absolute",
    bottom: tabletopUISpacing,
  },
  empty: {
    position: "absolute",
    zIndex: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default styles;
