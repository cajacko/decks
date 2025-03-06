import React from "react";
import { Pressable, StyleSheet, ViewStyle, View } from "react-native";
import CardSide from "@/components/CardSide";
import EditCardModal from "./EditCardModal";
import { Target } from "@/utils/cardTarget";
import { selectCanEditCard } from "@/store/combinedSelectors/cards";
import { useAppSelector } from "@/store/hooks";

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

  const canEditCard = useAppSelector((state) =>
    selectCanEditCard(state, { cardId }),
  );

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

  const cardSide = (
    <CardSide id={cardId} type="card" side="front" skeleton={skeleton} />
  );

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
      {canEditCard ? (
        <Pressable
          key={cardId}
          onPress={skeleton ? undefined : open}
          style={style}
        >
          {cardSide}
        </Pressable>
      ) : (
        <View style={style}>{cardSide}</View>
      )}
    </>
  );
}

export const styles = StyleSheet.create({});
