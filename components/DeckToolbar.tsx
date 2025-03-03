import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";
import { useEditCardModal } from "./EditCardModal";
import text from "@/constants/text";
import IconSymbol from "./IconSymbol";
import ThemedText from "./ThemedText";
import { iconSize, horizontalPadding } from "./TabletopToolbar";

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
    title: text["deck.delete.title"],
    message: text["deck.delete.message"],
  });

  return (
    <View style={styles.container}>
      {deleteDeckModal.component}
      <TouchableOpacity
        onPressOut={props.openDefaultCardModal}
        style={styles.action}
      >
        <ThemedText style={styles.actionText} type="button">
          {text["deck.actions.default"]}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPressOut={deleteDeckModal.open} style={styles.action}>
        <IconSymbol name="delete" size={iconSize} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    paddingHorizontal: horizontalPadding,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    textAlign: "center",
  },
});
