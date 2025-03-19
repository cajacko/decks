import React from "react";
import { Pressable, StyleSheet, ViewStyle, View } from "react-native";
import Card from "@/components/cards/connected/Card";
import { Target } from "@/utils/cardTarget";
import { selectCanEditCard } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";
import { selectCanEditDeck } from "@/store/slices/decks";

export type DeckCardProps = Target & {
  quantity?: number;
  style?: ViewStyle;
  skeleton?: boolean;
  editCard: (target: Target) => void;
};

export default function DeckCard({
  id,
  type,
  style,
  skeleton,
  editCard,
}: DeckCardProps): React.ReactNode {
  const target = React.useMemo<Target>(() => ({ id, type }), [id, type]);

  const canEdit = useAppSelector((state) =>
    target?.type === "card"
      ? selectCanEditCard(state, { cardId: target.id })
      : target?.type === "new-card-in-deck"
        ? selectCanEditDeck(state, { deckId: target.id })
        : false,
  );

  const cardSide = <Card target={target} side="front" skeleton={skeleton} />;

  const open = React.useCallback(() => editCard(target), [editCard, target]);

  return (
    <>
      {canEdit ? (
        <Pressable onPress={skeleton ? undefined : open} style={style}>
          {cardSide}
        </Pressable>
      ) : (
        <View style={style}>{cardSide}</View>
      )}
    </>
  );
}

export const styles = StyleSheet.create({});
