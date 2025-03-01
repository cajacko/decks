import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useRouter } from "expo-router";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import { Target } from "@/utils/cardTarget";
import EditCardModal from "./EditCardModal";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";
import { useEditCardModal } from "./EditCardModal";

interface DeckToolbarProps {
  deckId: string;
}

export function useDeckToolbar({
  deckId,
}: {
  deckId: string;
}): DeckToolbarProps {
  const headerRight = React.useCallback(
    () => <DeckToolbar deckId={deckId} />,
    [deckId],
  );

  useParentHeaderRight(headerRight, "deck");

  return {
    deckId,
  };
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  // NOTE: This component will only re-render on prop changes, no state changes
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const defaultCard = useEditCardModal({
    type: "new-card-in-deck",
    id: props.deckId,
  });

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

  const [showEditModal, setShowEditModal] = React.useState(false);
  const closeEditModal = React.useCallback(() => setShowEditModal(false), []);

  const target = React.useMemo<Target>(
    () => ({
      type: "new-card-in-deck",
      id: props.deckId,
    }),
    [props.deckId],
  );

  return (
    <View style={styles.container}>
      <EditCardModal
        visible={showEditModal}
        target={target}
        onRequestClose={closeEditModal}
      />
      {deleteDeckModal.component}
      {defaultCard.component}
      <TouchableHighlight onPressOut={defaultCard.open} style={styles.action}>
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
