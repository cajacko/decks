import React from "react";
import { StyleSheet, View, ViewStyle, ScrollView, Button } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard from "./DeckCard";
import EditCardModal from "./EditCardModal";
import { Target } from "@/utils/cardTarget";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const cards = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  const deleteDeck = React.useCallback(() => {
    navigate("/");

    dispatch(deleteDeckHelper({ deckId: props.deckId }));
  }, [props.deckId, dispatch, navigate]);

  const { open, component } = useDeleteWarning({
    handleDelete: deleteDeck,
    title: "Delete Deck",
    message:
      "Are you sure you want to delete this deck? If you delete this deck, all cards in this deck will be deleted as well.",
  });

  const children = React.useMemo(
    () =>
      cards?.map(({ cardId, quantity }) => (
        <DeckCard
          key={cardId}
          cardId={cardId}
          deckId={props.deckId}
          quantity={quantity}
        />
      )),
    [cards, props.deckId],
  );

  const [showEditModal, setShowEditModal] = React.useState(false);
  const closeEditModal = React.useCallback(() => setShowEditModal(false), []);

  const [target, setTarget] = React.useState<Target | null>(null);

  const openNewCard = React.useCallback(() => {
    setShowEditModal(true);
    setTarget({ id: props.deckId, type: "new-card-in-deck" });
  }, [props.deckId]);

  const openEditDefault = React.useCallback(() => {
    setShowEditModal(true);
    setTarget({ id: props.deckId, type: "deck-defaults" });
  }, [props.deckId]);

  return (
    <View style={props.style}>
      {component}
      <View style={styles.container}>
        {target && (
          <EditCardModal
            target={target}
            onChangeTarget={setTarget}
            onDelete={closeEditModal}
            visible={showEditModal}
            onRequestClose={closeEditModal}
          />
        )}
        <View style={styles.button}>
          <Button title="Edit Card Defaults" onPress={openEditDefault} />
        </View>
        <View style={styles.button}>
          <Button title="Add Card" onPress={openNewCard} />
        </View>
        <View style={styles.button}>
          <Button
            title="Play"
            onPress={() => navigate(`/deck/${props.deckId}/play`)}
          />
        </View>
        <View style={styles.button}>
          <Button title="Delete" onPress={open} />
        </View>
      </View>
      <DeckDetails deckId={props.deckId} />
      <ScrollView>{children}</ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
