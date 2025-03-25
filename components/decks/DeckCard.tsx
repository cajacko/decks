import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Card from "@/components/cards/connected/Card";
import { Target } from "@/utils/cardTarget";
import useVibrate from "@/hooks/useVibrate";

export type DeckCardProps = Target & {
  quantity?: number;
  style?: ViewStyle;
  skeleton?: boolean;
  editCard: (target: Target) => void;
  deckId: string;
};

export default function DeckCard({
  id,
  type,
  style,
  skeleton,
  editCard,
  deckId,
}: DeckCardProps): React.ReactNode {
  const { vibrate } = useVibrate();
  const target = React.useMemo<Target>(() => ({ id, type }), [id, type]);

  const cardSide = <Card target={target} side="front" skeleton={skeleton} />;

  const open = React.useCallback(() => {
    vibrate?.("DeckCard");

    editCard(target);
  }, [editCard, target, vibrate]);

  return (
    <Pressable onPress={skeleton ? undefined : open} style={style}>
      {cardSide}
    </Pressable>
  );
}

export const styles = StyleSheet.create({});
