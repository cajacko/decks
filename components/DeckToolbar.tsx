import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useRouter } from "expo-router";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";
import { useEditCardModal } from "./EditCardModal";

interface DeckToolbarProps {
  deckId: string;
  openDefaultCardModal: () => void;
}

export function useDeckToolbar({ deckId }: { deckId: string }) {
  const defaultCard = useEditCardModal({
    type: "deck-defaults",
    id: deckId,
  });

  const headerRight = React.useCallback(
    () => (
      <DeckToolbar deckId={deckId} openDefaultCardModal={defaultCard.open} />
    ),
    [deckId, defaultCard.open],
  );

  useParentHeaderRight(headerRight, "deck");

  return {
    deckId,
    defaultCard,
  };
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  // NOTE: This component will only re-render on prop changes, no state changes
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();

  const deleteDeck = React.useCallback(() => {
    navigate("/");

    dispatch(deleteDeckHelper({ deckId: props.deckId }));
  }, [props.deckId, dispatch, navigate]);

  const deleteDeckModal = useDeleteWarning({
    handleDelete: deleteDeck,
    title: "Delete Deck",
    message:
      "Are you sure you want to delete this deck? If you delete this deck, all cards in this deck will be deleted as well.",
  });

  return (
    <View style={styles.container}>
      {deleteDeckModal.component}
      <TouchableHighlight
        onPressOut={props.openDefaultCardModal}
        style={styles.action}
      >
        <Text style={styles.actionText}>Defaults</Text>
      </TouchableHighlight>
      <TouchableHighlight
        onPressOut={deleteDeckModal.open}
        style={styles.action}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    marginLeft: 10,
    backgroundColor: "blue",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionText: {
    color: "white",
    textAlign: "center",
  },
});
