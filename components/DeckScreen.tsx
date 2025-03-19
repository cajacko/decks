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
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import { maxWidth } from "./DecksScreen";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";
import Loader from "@/components/Loader";
import { CardConstraintsProvider } from "./cards/context/CardSizeConstraints";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

type FlatListData = null | {
  cardId: string;
  quantity: number;
};

const keyExtractor: FlatListProps<FlatListData>["keyExtractor"] = (item) =>
  item?.cardId ?? "null";

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

  const cards = React.useMemo<FlatListData[] | null>(() => {
    if (skeleton) return null;

    if (!cardsState || cardsState.length === 0) {
      return [null];
    }

    return cardsState;
  }, [cardsState, skeleton]);

  const { open, component } = useEditCardModal({
    type: "new-card-in-deck",
    id: props.deckId,
  });

  // Memoized renderItem to prevent unnecessary re-renders
  const renderItem = React.useCallback<
    NonNullable<FlatListProps<FlatListData>["renderItem"]>
  >(
    ({ item }) => (
      <DeckCard
        style={styles.item}
        id={item?.cardId ?? props.deckId}
        type={item ? "card" : "new-card-in-deck"}
        quantity={item?.quantity}
        skeleton={skeleton}
        editCard={open}
      />
    ),
    [skeleton, props.deckId, open],
  );

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  const addNew = React.useCallback(() => {
    open({
      id: props.deckId,
      type: "new-card-in-deck",
    });
  }, [open, props.deckId]);

  return (
    <CardConstraintsProvider {...styles.constraints}>
      <DeckToolbar deckId={props.deckId} />
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
            <>
              <DeckDetails deckId={props.deckId} skeleton={skeleton} />
              {skeleton && (
                <View style={styles.loader}>
                  <Loader />
                </View>
              )}
            </>
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
          <IconButton icon="add" onPress={addNew} style={styles.button} />
        )}
      </View>
    </CardConstraintsProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    maxWidth,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    // overflow: "hidden",
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
