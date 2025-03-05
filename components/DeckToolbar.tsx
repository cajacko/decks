import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";
import { useEditCardModal } from "./EditCardModal";
import text from "@/constants/text";
import { iconSize, horizontalPadding } from "./TabletopToolbar";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import Button from "./Button";
import IconButton from "./IconButton";

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

  useParentHeaderRight(headerRight);

  return {
    deckId,
    defaultCard,
  };
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  // NOTE: This component will only re-render on prop changes, no state changes
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const { entering, exiting } = useLayoutAnimations();

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
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={styles.container}
    >
      {deleteDeckModal.component}
      <Button
        onPressOut={props.openDefaultCardModal}
        style={styles.action}
        title={text["deck.actions.default"]}
        variant="transparent"
      />
      <IconButton
        icon="delete"
        size={iconSize}
        variant="transparent"
        onPressOut={deleteDeckModal.open}
        style={styles.action}
      />
    </Animated.View>
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
});
