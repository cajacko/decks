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
import { selectCanEditDeck, selectDeckCards } from "@/store/slices/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard from "./DeckCard";
import { useEditCardModal } from "./EditCardModal";
import DeckToolbar from "./DeckToolbar";
import IconButton from "./IconButton";
import { DeckCardSizeProvider } from "@/context/Deck";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import { maxWidth } from "./DecksScreen";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";

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
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId: props.deckId }),
  );

  useDeckLastScreen({
    deckId: props.deckId,
    screen: "deck",
  });

  const numColumns = React.useRef(
    Math.max(
      Math.round(Math.min(Dimensions.get("window").width, maxWidth) / 160),
      2,
    ),
  );

  const cardsState = useAppSelector((state) =>
    selectDeckCards(state, { deckId: props.deckId }),
  );

  const cards = React.useMemo(
    () =>
      skeleton
        ? cardsState?.slice(0, numColumns.current * initialRows)
        : cardsState,
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

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <DeckCardSizeProvider
      id={props.deckId}
      idType="deck"
      constraints={styles.constraints}
    >
      <DeckToolbar deckId={props.deckId} />
      {!skeleton && (
        <View style={containerStyle}>
          {component}
          <FlatList<FlatListData>
            data={cards}
            numColumns={numColumns.current}
            initialNumToRender={numColumns.current * initialRows}
            columnWrapperStyle={styles.columnWrapperStyle}
            windowSize={5}
            maxToRenderPerBatch={numColumns.current * 2}
            removeClippedSubviews={true}
            ListHeaderComponent={
              <DeckDetails deckId={props.deckId} skeleton={skeleton} />
            }
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={styles.list}
            // TODO: Can calculate this once and improve performance
            // getItemLayout={(data, index) => ({
            //   length: ITEM_HEIGHT,
            //   offset: ITEM_HEIGHT * index,
            //   index,
            // })}
          />
          {canEditDeck && (
            <IconButton icon="add" onPress={open} style={styles.button} />
          )}
        </View>
      )}
    </DeckCardSizeProvider>
  );
}

const styles = StyleSheet.create({
  list: {
    maxWidth,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
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
