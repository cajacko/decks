import ThemedText from "@/components/ui/ThemedText";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface NumberProps {
  number: number;
  style?: StyleProp<ViewStyle>;
}

export default function Number({ number }: NumberProps): React.ReactNode {
  return <ThemedText type="h2">{number}</ThemedText>;
}
