import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import CardSide, { CardSideProps } from "./CardSide";
import CardSpacer from "./CardSpacer";
import { useScaleValue } from "@/components/Card/CardSize.context";

export type CardSideBySideProps = Omit<CardSideProps, "side">;

const sideOffset = 19;
const topOffset = 100;

export default function CardSideBySide(
  props: CardSideBySideProps,
): React.ReactNode {
  const scaleValue = useScaleValue();

  // TODO: These aren't accurate, need to do trigonometry to get the correct
  // offsets based off the rotation of the cards
  const { front, back, inner } = React.useMemo<
    Record<"front" | "back" | "inner", ViewStyle>
  >(
    () => ({
      front: {
        left: scaleValue(sideOffset),
        top: scaleValue(topOffset),
      },
      back: {
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
            style: [
              styles.card,
              styles.frontCard,
              {
                transform: [{ rotate: "-5deg" }],
                ...front,
              },
              props.CardProps?.style,
            ],
          }}
          side="front"
        />
        <CardSide
          {...props}
          CardProps={{
            ...props.CardProps,
            style: [
              styles.card,
              styles.backCard,
              {
                transform: [{ rotate: "5deg" }],
                ...back,
              },
              props.CardProps?.style,
            ],
          }}
          side="back"
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
