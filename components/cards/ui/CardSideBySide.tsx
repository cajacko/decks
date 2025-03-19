import React from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useMmToDp, UseMmToDpProps } from "../context/PhysicalMeasures";

export interface CardSideBySideProps extends UseMmToDpProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

const sideOffset = 4;
const topOffset = 12;

export default function CardSideBySide({
  children: [front, back, spacer],
  ...props
}: CardSideBySideProps): React.ReactNode {
  const mmToDp = useMmToDp(props);

  // TODO: These aren't accurate, need to do trigonometry to get the correct
  // offsets based off the rotation of the cards
  const { top, bottom, inner } = React.useMemo<
    Record<"top" | "bottom" | "inner", StyleProp<ViewStyle>>
  >(
    () => ({
      top: [
        styles.frontCard,
        {
          left: mmToDp(sideOffset),
          top: mmToDp(topOffset),
        },
      ],
      bottom: [
        styles.backCard,
        {
          top: mmToDp(3),
          right: mmToDp(sideOffset),
        },
      ],
      inner: [
        styles.inner,
        {
          paddingVertical: mmToDp(2 + topOffset / 2),
          // Controls the total width
          paddingHorizontal: mmToDp(12),
        },
      ],
    }),
    [mmToDp],
  );

  return (
    <View style={styles.container}>
      <View style={inner}>
        <View style={top}>{front}</View>
        <View style={bottom}>{back}</View>
        {spacer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    position: "relative",
  },
  frontCard: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    transform: [{ rotate: "355deg" }],
  },
  backCard: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    transform: [{ rotate: "5deg" }],
  },
});
