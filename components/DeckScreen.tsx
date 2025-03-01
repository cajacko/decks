import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  FlatList,
  Dimensions,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard from "./DeckCard";
import { useEditCardModal } from "./EditCardModal";
import { useDeckToolbar } from "./DeckToolbar";
import IconButton from "./IconButton";
import { DeckCardSizeProvider } from "@/context/Deck";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  useDeckToolbar({ deckId: props.deckId });

  const cards = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  const { open, component } = useEditCardModal({
    type: "new-card-in-deck",
    id: props.deckId,
  });

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.constraints}
    >
      <View style={props.style}>
        {component}
        <DeckDetails deckId={props.deckId} />
        <FlatList
          data={cards}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapperStyle}
          renderItem={({ item }) => (
            <DeckCard
              style={styles.item}
              cardId={item.cardId}
              quantity={item.quantity}
            />
          )}
          keyExtractor={(item) => item.cardId}
          style={styles.container}
        />
        <IconButton icon="+" onPress={open} style={styles.button} />
      </View>
    </DeckCardSizeProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
  columnWrapperStyle: {},
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  constraints: {
    maxWidth: Dimensions.get("window").width / 3 - 20,
    maxHeight: 200,
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
