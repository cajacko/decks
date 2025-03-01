import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import CardSide from "@/components/CardSide";
import EditCardModal from "./EditCardModal";
import { Target } from "@/utils/cardTarget";

export interface DeckCardProps {
  cardId: string;
  quantity: number;
  style?: ViewStyle;
}

export default function DeckCard({
  cardId,
  style,
}: DeckCardProps): React.ReactNode {
  const [showEditModal, setShowEditModal] = React.useState(false);
  const target = React.useMemo(
    (): Target => ({ type: "card", id: cardId }),
    [cardId],
  );

  const close = React.useCallback(() => {
    setShowEditModal(false);
  }, []);

  const open = React.useCallback(() => {
    setShowEditModal(true);
  }, []);

  return (
    <>
      <EditCardModal
        target={target}
        initialSide="front"
        onRequestClose={close}
        visible={showEditModal}
        onDelete={close}
      />
      <Pressable key={cardId} onPress={open} style={style}>
        <CardSide id={cardId} type="card" side="front" />
      </Pressable>
    </>
  );
}

export const styles = StyleSheet.create({});
