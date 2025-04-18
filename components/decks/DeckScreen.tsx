import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Platform,
  FlatListProps,
} from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectCanEditDeck, selectDeckCards } from "@/store/selectors/decks";
import DeckDetails, {
  DeckDetailsSkeleton,
} from "@/components/decks/DeckDetails";
import DeckCard, { DeckCardSkeleton } from "./DeckCard";
import { useEditCardModal, Open } from "../editCard/EditCardModal";
import IconButton, {
  getFloatingButtonVerticalAllowance,
  styles as iconButtonStyles,
} from "../forms/IconButton";
import Loader from "@/components/ui/Loader";
import { CardConstraintsProvider } from "../cards/context/CardSizeConstraints";
import ContentWidth, { getContentWidth } from "@/components/ui/ContentWidth";
import DeckDefaults, {
  DeckDefaultsSkeleton,
} from "@/components/decks/DeckDefaults";
import ThemedText from "../ui/ThemedText";
import text from "@/constants/text";
import { FlatList } from "react-native-gesture-handler";
import { useRequiredContainerWidth } from "@/context/ContainerSize";

export interface DeckScreenProps {
  deckId: string;
  style?: ViewStyle;
}

type FlatListData = null | {
  cardId: string;
  quantity: number;
};

const keyExtractor: NonNullable<FlatListProps<FlatListData>["keyExtractor"]> = (
  item,
) => item?.cardId ?? "null";

const cardWidth = 100;
const minCardHorizontalMargin = 10;
const initialRows = 4;

type FlatListLayoutProps = Pick<
  FlatListProps<unknown>,
  | "numColumns"
  | "getItemLayout"
  | "initialNumToRender"
  | "windowSize"
  | "maxToRenderPerBatch"
  | "removeClippedSubviews"
>;

const contentWidthPadding = undefined;

function useDeckCardListProps(): {
  cardListProps: {
    cardWidth: number;
    flatList: FlatListLayoutProps;
  };
} {
  const availableWidth = useRequiredContainerWidth();

  const contentWidth = getContentWidth({
    availableWidth,
    padding: contentWidthPadding,
  });

  // Needs to be a ref as it can't change dynamically
  const { current: numColumns } = React.useRef(
    Math.floor(contentWidth / (cardWidth + minCardHorizontalMargin)),
  );

  return {
    // We can't dynamically update the number of columns
    // based on the width of the container, so we don't need to
    // update the layout
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

function DeckScreenContent<D>(props: {
  data: FlatListProps<D>["data"];
  renderItem: NonNullable<FlatListProps<D>["renderItem"]>;
  keyExtractor: NonNullable<FlatListProps<D>["keyExtractor"]>;
  showLoader: boolean;
  deckDetails: React.ReactNode;
  deckDefaults: React.ReactNode;
  title?: React.ReactNode;
  deckId?: string;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const { cardListProps } = useDeckCardListProps();

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  return (
    <ContentWidth
      style={containerStyle}
      contentContainerStyle={styles.container}
      padding={contentWidthPadding}
    >
      <View style={styles.inner}>
        <CardConstraintsProvider width={cardListProps.cardWidth}>
          <FlatList<D>
            {...cardListProps.flatList}
            data={props.data}
            style={styles.scroll}
            contentContainerStyle={styles.contentContainerStyle}
            showsVerticalScrollIndicator={Platform.OS !== "web"}
            ListHeaderComponent={
              <ContentWidth padding="standard">
                {props.deckDetails}
                {props.showLoader ? (
                  <View style={styles.loader}>
                    <Loader />
                  </View>
                ) : (
                  <>
                    {props.deckDefaults}
                    {props.title}
                  </>
                )}
              </ContentWidth>
            }
            renderItem={props.renderItem}
            keyExtractor={props.keyExtractor}
          />
        </CardConstraintsProvider>
      </View>
    </ContentWidth>
  );
}

type SkeletonData = {
  key: string;
};

function AddButton({ deckId, open }: { deckId: string; open: Open }) {
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId }),
  );

  const addNew = React.useCallback(() => {
    open({
      id: deckId,
      type: "new-card-in-deck",
    });
  }, [open, deckId]);

  if (!canEditDeck) return null;

  return (
    <IconButton
      icon="add"
      onPress={addNew}
      style={iconButtonStyles.floating}
      vibrate
    />
  );
}

export function DeckScreenSkeleton(props: Omit<DeckScreenProps, "deckId">) {
  const { cardListProps } = useDeckCardListProps();

  const numColumns = cardListProps.flatList.numColumns ?? 3;

  const data: SkeletonData[] = React.useMemo(
    () =>
      Array.from(
        { length: numColumns * 3 },
        (_, index): SkeletonData => ({
          key: `skeleton-${index}`,
        }),
      ),
    [numColumns],
  );

  const renderItem = React.useCallback<
    NonNullable<FlatListProps<SkeletonData>["renderItem"]>
  >(() => <DeckCardSkeleton style={styles.item} />, []);

  const keyExtractor = React.useCallback<
    NonNullable<FlatListProps<SkeletonData>["keyExtractor"]>
  >(({ key }) => key, []);

  return (
    <DeckScreenContent<SkeletonData>
      style={props.style}
      data={data}
      renderItem={renderItem}
      loading
      keyExtractor={keyExtractor}
      showLoader={false}
      deckDetails={<DeckDetailsSkeleton />}
      deckDefaults={<DeckDefaultsSkeleton style={styles.deckDefaults} />}
    />
  );
}

export default React.memo(function DeckScreen({
  deckId,
  style,
}: DeckScreenProps): React.ReactNode {
  const { open, component } = useEditCardModal({
    type: "new-card-in-deck",
    id: deckId,
  });

  const cardsState = useAppSelector((state) =>
    selectDeckCards(state, { deckId }),
  );

  const { cards, cardCount } = React.useMemo<{
    cards: FlatListData[];
    cardCount: number;
  }>(() => {
    if (!cardsState || cardsState.length === 0) {
      return { cards: [null], cardCount: 0 };
    }

    return { cards: cardsState, cardCount: cardsState.length };
  }, [cardsState]);

  // Memoized renderItem to prevent unnecessary re-renders
  const renderItem = React.useCallback<
    NonNullable<FlatListProps<FlatListData>["renderItem"]>
  >(
    ({ item }) => (
      <DeckCard
        style={styles.item}
        id={item?.cardId ?? deckId}
        type={item ? "card" : "new-card-in-deck"}
        quantity={item?.quantity}
        editCard={open}
        deckId={deckId}
      />
    ),
    [deckId, open],
  );

  const showLoader = false;

  return (
    <>
      {component}
      <DeckScreenContent<FlatListData>
        style={style}
        data={cards}
        loading={false}
        deckId={deckId}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showLoader={showLoader}
        deckDetails={<DeckDetails deckId={deckId} />}
        deckDefaults={
          <DeckDefaults style={styles.deckDefaults} deckId={deckId} />
        }
        title={
          <ThemedText style={styles.cardsHeader} type="h2">
            {text["deck_screen.cards.title"]} ({cardCount})
          </ThemedText>
        }
      />
      <AddButton deckId={deckId} open={open} />
    </>
  );
});

const styles = StyleSheet.create({
  loader: {
    alignItems: "center",
    justifyContent: "center",
  },
  deckDefaults: {
    marginTop: 10,
    marginBottom: 30,
  },
  container: {
    position: "relative",
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: getFloatingButtonVerticalAllowance(),
  },
  scroll: {
    maxHeight: "100%",
  },
  inner: {
    flex: 1,
  },
  cardsHeader: {
    marginBottom: 10,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
