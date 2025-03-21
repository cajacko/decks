import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  FlatList,
  FlatListProps,
  ViewProps,
  Platform,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectCanEditDeck, selectDeckCards } from "@/store/slices/decks";
import DeckDetails from "@/components/DeckDetails";
import DeckCard from "./DeckCard";
import { useEditCardModal } from "./EditCardModal";
import DeckToolbar from "./DeckToolbar";
import IconButton from "./IconButton";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";
import Loader from "@/components/Loader";
import { CardConstraintsProvider } from "./cards/context/CardSizeConstraints";
import ContentWidth from "@/components/ContentWidth";

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

const cardWidth = 100;
const minCardHorizontalMargin = 10;
const initialRows = 4;

function useDeckCardListProps(): {
  onLayout: ViewProps["onLayout"];
  cardListProps: null | {
    cardWidth: number;
    flatList: Pick<
      FlatListProps<FlatListData>,
      | "numColumns"
      | "getItemLayout"
      | "initialNumToRender"
      | "windowSize"
      | "maxToRenderPerBatch"
      | "removeClippedSubviews"
    >;
  };
} {
  const [contentWidth, setContentWidth] = React.useState<number | null>(null);

  const onLayout = React.useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => {
      setContentWidth(event.nativeEvent.layout.width);
    },
    [],
  );

  if (contentWidth === null) {
    return {
      onLayout,
      cardListProps: null,
    };
  }

  const numColumns = Math.floor(
    contentWidth / (cardWidth + minCardHorizontalMargin),
  );

  return {
    // We can't dynamically update the number of columns
    // based on the width of the container, so we don't need to
    // update the layout
    onLayout: undefined,
    cardListProps: {
      cardWidth,
      flatList: {
        numColumns,
        windowSize: 5,
        maxToRenderPerBatch: numColumns * 2,
        initialNumToRender: numColumns * initialRows,
        // TODO: Can calculate this once and improve performance
        // getItemLayout={(data, index) => ({
        //   length: ITEM_HEIGHT,
        //   offset: ITEM_HEIGHT * index,
        //   index,
        // })}
      },
    },
  };
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId: props.deckId }),
  );

  useDeckLastScreen({
    deckId: props.deckId,
    screen: "deck",
  });

  const { onLayout, cardListProps } = useDeckCardListProps();

  const skeleton = useScreenSkeleton(DeckScreen.name) && cardListProps !== null;

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
    <>
      <DeckToolbar deckId={props.deckId} />
      <ContentWidth
        style={containerStyle}
        contentContainerStyle={styles.container}
      >
        <View style={styles.inner} onLayout={onLayout}>
          {component}
          {cardListProps && (
            <CardConstraintsProvider width={cardListProps.cardWidth}>
              <FlatList<FlatListData>
                {...cardListProps.flatList}
                data={cards}
                columnWrapperStyle={styles.columnWrapperStyle}
                style={styles.scroll}
                showsVerticalScrollIndicator={Platform.OS !== "web"}
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
              />
            </CardConstraintsProvider>
          )}
        </View>
      </ContentWidth>
      {canEditDeck && (
        <IconButton icon="add" onPress={addNew} style={styles.button} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    flex: 1,
  },
  scroll: {
    // flex: 1,
    maxHeight: "100%",
  },
  inner: {
    flex: 1,
  },
  columnWrapperStyle: {},
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
