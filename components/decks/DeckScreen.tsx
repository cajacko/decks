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
import DeckDetails, {
  DeckDetailsSkeleton,
} from "@/components/decks/DeckDetails";
import DeckCard, { DeckCardSkeleton } from "./DeckCard";
import { useEditCardModal, Open } from "../editCard/EditCardModal";
import DeckToolbar from "./DeckToolbar";
import IconButton, {
  getFloatingButtonVerticalAllowance,
  styles as iconButtonStyles,
} from "../forms/IconButton";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";
import Loader from "@/components/ui/Loader";
import { CardConstraintsProvider } from "../cards/context/CardSizeConstraints";
import ContentWidth from "@/components/ui/ContentWidth";
import DeckDefaults, {
  DeckDefaultsSkeleton,
} from "@/components/decks/DeckDefaults";
import ThemedText from "../ui/ThemedText";
import text from "@/constants/text";
import { DrawerChildren } from "@/context/Drawer";
import SettingsDeck from "@/components/settings/SettingsDeck";

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

function useDeckCardListProps(): {
  onLayout: ViewProps["onLayout"];
  cardListProps: null | {
    cardWidth: number;
    flatList: FlatListLayoutProps;
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

function DeckScreenContent<D>(props: {
  flatListProps: FlatListLayoutProps;
  data: FlatListProps<D>["data"];
  renderItem: NonNullable<FlatListProps<D>["renderItem"]>;
  keyExtractor: NonNullable<FlatListProps<D>["keyExtractor"]>;
  showLoader: boolean;
  deckDetails: React.ReactNode;
  deckDefaults: React.ReactNode;
  title?: React.ReactNode;
}) {
  return (
    <FlatList<D>
      {...props.flatListProps}
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
  );
}

type SkeletonData = {
  key: string;
};

function DeckScreenSkeleton({
  flatListProps,
}: {
  flatListProps: FlatListLayoutProps;
}) {
  const numColumns = flatListProps.numColumns ?? 3;

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
      flatListProps={flatListProps}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showLoader={false}
      deckDetails={<DeckDetailsSkeleton />}
      deckDefaults={<DeckDefaultsSkeleton style={styles.deckDefaults} />}
    />
  );
}

function ConnectedDeckScreen({
  deckId,
  flatListProps,
  open,
}: {
  deckId: string;
  flatListProps: FlatListLayoutProps;
  open: Open;
}) {
  const cardsState = useAppSelector((state) =>
    selectDeckCards(state, { deckId }),
  );

  const cards = React.useMemo<FlatListData[] | null>(() => {
    if (!cardsState || cardsState.length === 0) {
      return [null];
    }

    return cardsState;
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
    <DeckScreenContent<FlatListData>
      flatListProps={flatListProps}
      data={cards}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showLoader={showLoader}
      deckDetails={<DeckDetails deckId={deckId} />}
      deckDefaults={
        <DeckDefaults style={styles.deckDefaults} deckId={deckId} />
      }
      title={
        <ThemedText style={styles.cardsHeader} type="h2">
          {text["deck_screen.cards.title"]}
        </ThemedText>
      }
    />
  );
}

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
    <IconButton icon="add" onPress={addNew} style={iconButtonStyles.floating} />
  );
}

export default function DeckScreen(props: DeckScreenProps): React.ReactNode {
  const { onLayout, cardListProps } = useDeckCardListProps();
  const skeleton = useScreenSkeleton(DeckScreen.name) && cardListProps !== null;

  useDeckLastScreen({
    deckId: props.deckId,
    screen: "deck",
  });

  const containerStyle = React.useMemo(
    () => [styles.container, props.style],
    [props.style],
  );

  const { open, component } = useEditCardModal({
    type: "new-card-in-deck",
    id: props.deckId,
  });

  return (
    <>
      {component}
      <DeckToolbar deckId={props.deckId} loading={skeleton} />
      <DrawerChildren>
        <SettingsDeck deckId={props.deckId} />
      </DrawerChildren>
      <ContentWidth
        style={containerStyle}
        contentContainerStyle={styles.container}
      >
        <View style={styles.inner} onLayout={onLayout}>
          {cardListProps && (
            <CardConstraintsProvider width={cardListProps.cardWidth}>
              {skeleton ? (
                <DeckScreenSkeleton flatListProps={cardListProps.flatList} />
              ) : (
                <ConnectedDeckScreen
                  deckId={props.deckId}
                  open={open}
                  flatListProps={cardListProps.flatList}
                />
              )}
            </CardConstraintsProvider>
          )}
        </View>
      </ContentWidth>
      {!skeleton && <AddButton deckId={props.deckId} open={open} />}
    </>
  );
}

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
