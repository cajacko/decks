import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  FlatList,
  Dimensions,
  FlatListProps,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectDeckCards } from "@/store/slices/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard from "./DeckCard";
import { useEditCardModal } from "./EditCardModal";
import { useDeckToolbar } from "./DeckToolbar";
import IconButton from "./IconButton";
import { DeckCardSizeProvider } from "@/context/Deck";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

interface FlatListData {
  cardId: string;
  quantity: number;
}

const keyExtractor: FlatListProps<FlatListData>["keyExtractor"] = (item) =>
  item.cardId;

const initialRows = 4;

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const skeleton = useScreenSkeleton(DeckScreen.name);
  const numColumns = 3;
  const { defaultCard } = useDeckToolbar({ deckId: props.deckId });

  const cardsState = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  const cards = React.useMemo(
    () =>
      skeleton ? cardsState?.slice(0, numColumns * initialRows) : cardsState,
    [cardsState, skeleton, numColumns],
  );

  // Memoized renderItem to prevent unnecessary re-renders
  const renderItem = React.useCallback<
    NonNullable<FlatListProps<FlatListData>["renderItem"]>
  >(
    ({ item }) => (
      <DeckCard
        style={styles.item}
        cardId={item.cardId}
        quantity={item.quantity}
        skeleton={skeleton}
      />
    ),
    [skeleton],
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
      {!skeleton && (
        <View style={props.style}>
          {component}
          {defaultCard.component}
          <FlatList<FlatListData>
            data={cards}
            numColumns={numColumns}
            initialNumToRender={numColumns * initialRows}
            columnWrapperStyle={styles.columnWrapperStyle}
            windowSize={5}
            maxToRenderPerBatch={numColumns * 2}
            removeClippedSubviews={true}
            ListHeaderComponent={
              <DeckDetails deckId={props.deckId} skeleton={skeleton} />
            }
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.container}
            // TODO: Can calculate this once and improve performance
            // getItemLayout={(data, index) => ({
            //   length: ITEM_HEIGHT,
            //   offset: ITEM_HEIGHT * index,
            //   index,
            // })}
          />
          <IconButton icon="add" onPress={open} style={styles.button} />
        </View>
      )}
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
