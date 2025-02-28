import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  Button,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import CardSide from "@/components/CardSide";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const cards = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  const deleteDeck = React.useCallback(() => {
    push("/");

    dispatch(deleteDeckHelper({ deckId: props.deckId }));
  }, [props.deckId, dispatch, push]);

  const { open, component } = useDeleteWarning({
    handleDelete: deleteDeck,
    title: "Delete Deck",
    message:
      "Are you sure you want to delete this deck? If you delete this deck, all cards in this deck will be deleted as well.",
  });

  return (
    <View style={props.style}>
      {component}
      <View style={styles.container}>
        <View style={styles.button}>
          <Button
            title="Edit Card Defaults"
            onPress={() => push(`/deck/${props.deckId}/card-defaults`)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Add Card"
            onPress={() => push(`/deck/${props.deckId}/new-card`)}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Play"
            onPress={() => push(`/deck/${props.deckId}/play`)}
          />
        </View>
        <View style={styles.button}>
          <Button title="Delete" onPress={open} />
        </View>
      </View>
      <ScrollView>
        {cards?.map((card) => (
          <Pressable
            onPress={() => push(`/deck/${props.deckId}/card/${card.cardId}`)}
          >
            <CardSide
              key={card.cardId}
              id={card.cardId}
              type="card"
              side="front"
            />
          </Pressable>
        ))}
      </ScrollView>
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
