import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import CardSide from "@/components/CardSide";
import EditCardModal from "./EditCardModal";
import { Target } from "@/utils/cardTarget";

export interface DeckCardProps {
  cardId: string;
  quantity: number;
  style?: ViewStyle;
  skeleton?: boolean;
}

export default function DeckCard({
  cardId,
  style,
  skeleton,
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
      {!skeleton && (
        <EditCardModal
          target={target}
          initialSide="front"
          onRequestClose={close}
          visible={showEditModal}
          onDelete={close}
        />
      )}
      <Pressable
        key={cardId}
        onPress={skeleton ? undefined : open}
        style={style}
      >
        <CardSide id={cardId} type="card" side="front" skeleton={skeleton} />
      </Pressable>
    </>
  );
}

export const styles = StyleSheet.create({});
