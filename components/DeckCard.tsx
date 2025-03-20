import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import Card from "@/components/cards/connected/Card";
import { Target } from "@/utils/cardTarget";
import { selectCanEditCard } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";
import { selectCanEditDeck } from "@/store/slices/decks";
import useCopyToEditAlert from "@/hooks/useCopyToEditAlert";
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
  const { open: openCopyDeck, component } = useCopyToEditAlert({ deckId });

  const canEdit = useAppSelector((state) =>
    target?.type === "card"
      ? selectCanEditCard(state, { cardId: target.id })
      : target?.type === "new-card-in-deck"
        ? selectCanEditDeck(state, { deckId: target.id })
        : false,
  );

  const cardSide = <Card target={target} side="front" skeleton={skeleton} />;

  const open = React.useCallback(() => {
    vibrate?.("DeckCard");

    if (canEdit) {
      editCard(target);
    } else {
      openCopyDeck();
    }
  }, [editCard, target, openCopyDeck, canEdit, vibrate]);

  return (
    <>
      {component}
      <Pressable onPress={skeleton ? undefined : open} style={style}>
        {cardSide}
      </Pressable>
    </>
  );
}

export const styles = StyleSheet.create({});
