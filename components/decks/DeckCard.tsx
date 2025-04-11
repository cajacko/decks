import React from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import Card from "@/components/cards/connected/Card";
import { Target } from "@/utils/cardTarget";
import useVibrate from "@/hooks/useVibrate";
import CardSkeleton from "@/components/cards/connected/CardSkeleton";
import { TouchableScale } from "@/components/ui/Pressables";

export type DeckCardProps = Target & {
  quantity?: number;
  style?: ViewStyle;
  editCard: (target: Target) => void;
  deckId: string;
};

export function DeckCardSkeleton({ style }: Pick<DeckCardProps, "style">) {
  return (
    <View style={style}>
      <CardSkeleton />
    </View>
  );
}

export default function DeckCard({
  id,
  type,
  style,
  editCard,
}: DeckCardProps): React.ReactNode {
  const { vibrate } = useVibrate();
  const target = React.useMemo<Target>(() => ({ id, type }), [id, type]);

  const cardSide = <Card target={target} side="front" />;

  const open = React.useCallback(() => {
    vibrate?.("DeckCard");

    editCard(target);
  }, [editCard, target, vibrate]);

  return (
    <TouchableScale onPress={open} style={style}>
      {cardSide}
    </TouchableScale>
  );
}

export const styles = StyleSheet.create({});
