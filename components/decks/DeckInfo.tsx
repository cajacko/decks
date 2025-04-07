import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export interface DeckInfoProps {
  deckId: string;
  style?: StyleProp<ViewStyle>;
}

export default function DeckInfo({
  deckId,
  style,
}: DeckInfoProps): React.ReactNode {
  return <View style={style}></View>;
}
