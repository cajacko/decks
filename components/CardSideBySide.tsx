import React from "react";
import { View } from "react-native";
import CardSide, { CardSideProps } from "./CardSide";

export interface CardSideBySideProps extends Omit<CardSideProps, "side"> {
  maxHeight: number;
  maxWidth: number;
}

export default function CardSideBySide({
  maxHeight,
  maxWidth,
  ...props
}: CardSideBySideProps): React.ReactNode {
  return (
    <View>
      <CardSide {...props} side="front" />
      <CardSide {...props} side="back" />
    </View>
  );
}
