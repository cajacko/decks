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
import { useAppSelector } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import CardSide from "@/components/CardSide";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const { push } = useRouter();
  const cards = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  return (
    <View style={props.style}>
      <View style={styles.container}>
        <Button
          title="Edit Card Defaults"
          onPress={() => push(`/deck/${props.deckId}/card-defaults`)}
        />
        <Button
          title="Add Card"
          onPress={() => push(`/deck/${props.deckId}/new-card`)}
        />
        <Button
          title="Play"
          onPress={() => push(`/deck/${props.deckId}/play`)}
        />
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
    alignItems: "center",
    justifyContent: "center",
  },
});
