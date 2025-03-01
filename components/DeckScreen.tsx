import React from "react";
import { StyleSheet, View, ViewStyle, ScrollView } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard, { styles as deckCardStyles } from "./DeckCard";
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

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={deckCardStyles.constraints}
    >
      <View style={props.style}>
        {component}
        <DeckDetails deckId={props.deckId} />
        <ScrollView>{children}</ScrollView>
        <IconButton icon="+" onPress={open} style={styles.button} />
      </View>
    </DeckCardSizeProvider>
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
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
