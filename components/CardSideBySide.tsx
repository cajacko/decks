import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import CardSide, { CardSideProps } from "./CardSide";
import CardSpacer from "./CardSpacer";
import { useScaleValue } from "@/components/Card/CardSize.context";
import { Cards } from "@/store/types";

export type CardSideBySideProps = Omit<CardSideProps, "side"> & {
  topSide?: Cards.Side;
};

const sideOffset = 19;
const topOffset = 100;

export default function CardSideBySide({
  topSide = "front",
  ...props
}: CardSideBySideProps): React.ReactNode {
  const scaleValue = useScaleValue();

  // TODO: These aren't accurate, need to do trigonometry to get the correct
  // offsets based off the rotation of the cards
  const { top, bottom, inner } = React.useMemo<
    Record<"top" | "bottom" | "inner", ViewStyle>
  >(
    () => ({
      top: {
        left: scaleValue(sideOffset),
        top: scaleValue(topOffset),
      },
      bottom: {
        top: 6,
        right: scaleValue(sideOffset),
      },
      inner: {
        paddingVertical: scaleValue(10 + topOffset / 2),
        paddingHorizontal: scaleValue(60),
      },
    }),
    [scaleValue],
  );

  return (
    <View style={styles.container}>
      <View style={[styles.inner, inner]}>
        <CardSide
          {...props}
          CardProps={{
            ...props.CardProps,
            initialRotation: -5,
            style: [styles.card, styles.frontCard, top, props.CardProps?.style],
          }}
          side={topSide}
        />
        <CardSide
          {...props}
          CardProps={{
            ...props.CardProps,
            initialRotation: 5,
            style: [
              styles.card,
              styles.backCard,
              bottom,
              props.CardProps?.style,
            ],
          }}
          side={topSide === "front" ? "back" : "front"}
        />
        <CardSpacer />
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
  card: {
    position: "absolute",
  },
  frontCard: {
    zIndex: 2,
    left: 0,
  },
  backCard: {
    zIndex: 1,
    right: 0,
  },
});
