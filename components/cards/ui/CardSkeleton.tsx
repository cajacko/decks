import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "@/components/ui/Skeleton";
import Card, { CardProps } from "@/components/cards/ui/Card";
import { useMmToDp } from "../context/PhysicalMeasures";
import { Cards } from "@/store/types";

export const defaultCardSizePreset = Cards.Size.Poker;

export interface CardSkeletonProps
  extends Omit<
    CardProps,
    "markup" | "values" | "deckValues" | "cardSideCacheKey"
  > {
  sizePreset?: Cards.Size;
}

export default React.memo(function CardSkeleton({
  sizePreset,
  shadow,
  ...cardProps
}: CardSkeletonProps): React.ReactNode {
  const mmToDp = useMmToDp({ sizePreset });
  const textHeight = mmToDp(4);
  const borderRadius = mmToDp(1.5);
  const imageSize = mmToDp(50);
  const headerWidth = imageSize / 2;
  const midWidth = (imageSize - headerWidth) / 2 + headerWidth;

  return (
    <Card
      cardSideCacheKey="skeleton"
      deckValues={null}
      markup={null}
      values={null}
      {...cardProps}
      shadow={undefined}
    >
      <Skeleton style={styles.container} variant="card">
        <Skeleton
          variant="image"
          width={imageSize}
          height={imageSize}
          borderRadius={borderRadius}
        />
        <View style={[styles.text, { marginTop: mmToDp(5) }]}>
          <Skeleton
            variant="text"
            width={headerWidth}
            height={textHeight}
            borderRadius={borderRadius}
            style={{ marginBottom: mmToDp(5) }}
          />
          <Skeleton
            variant="text"
            width={imageSize}
            height={textHeight}
            borderRadius={borderRadius}
          />
          <Skeleton
            variant="text"
            width={midWidth}
            height={textHeight}
            borderRadius={borderRadius}
            style={{ marginVertical: mmToDp(1) }}
          />
          <Skeleton
            variant="text"
            width={headerWidth}
            height={textHeight}
            borderRadius={borderRadius}
          />
        </View>
      </Skeleton>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
  },
});
