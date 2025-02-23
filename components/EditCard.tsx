import React from "react";
import { Pressable } from "react-native";
import CardSide from "@/components/CardSide";

export interface EditCardProps {
  cardId: string;
  onPress?: () => void;
}

export default function EditCard(props: EditCardProps): React.ReactNode {
  return (
    <Pressable onPress={props.onPress}>
      <CardSide cardId={props.cardId} side="front" />
    </Pressable>
  );
}
