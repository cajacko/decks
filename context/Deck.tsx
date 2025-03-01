import React from "react";
import {
  CardSizeProvider,
  CardSizeProviderProps,
} from "@/components/Card/CardSize.context";
import {
  TabletopProvider,
  TabletopProviderProps,
} from "@/components/Tabletop/Tabletop.context";
import { useAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { selectDeckByCard } from "@/store/combinedSelectors/cards";
import cardDimensions, { defaultCardDimensions } from "@/config/cardDimensions";
import { getStackDimensions } from "@/components/Stack/stack.style";
import { Dimensions } from "react-native";

function useCardProportions({
  id,
  idType,
}: {
  id: string;
  idType: "deck" | "card";
}) {
  const cardSize = useAppSelector((state) =>
    idType === "deck"
      ? selectDeck(state, { deckId: id })?.cardSize
      : selectDeckByCard(state, { cardId: id })?.cardSize,
  );

  return cardSize ? cardDimensions[cardSize] : defaultCardDimensions;
}

export function DeckTabletopProvider({
  deckId,
  ...props
}: Omit<TabletopProviderProps, "cardProportions"> & { deckId: string }) {
  const cardProportions = useCardProportions({
    id: deckId,
    idType: "deck",
  });

  return <TabletopProvider cardProportions={cardProportions} {...props} />;
}

type DeckCardSizeProviderProps = Omit<CardSizeProviderProps, "proportions"> & {
  id: string;
  idType: "deck" | "card";
};

export function DeckCardSizeProvider({
  id,
  idType,
  ...props
}: DeckCardSizeProviderProps) {
  const cardProportions = useCardProportions({ id, idType });

  return <CardSizeProvider proportions={cardProportions} {...props} />;
}

export function FullSizeCardProvider({
  availableHeight,
  availableWidth,
  ...props
}: Omit<DeckCardSizeProviderProps, "constraints"> & {
  availableHeight?: number;
  availableWidth?: number;
}) {
  const cardProportions = useCardProportions(props);

  const constraints = React.useMemo(() => {
    // The stack size is our usual full size view, use that
    const sizes = getStackDimensions({
      availableHeight: availableHeight ?? Dimensions.get("window").height,
      availableWidth: availableWidth ?? Dimensions.get("window").width,
      cardProportions,
    }).cardSizes;

    return {
      height: sizes.dpHeight,
      width: sizes.dpWidth,
    };
  }, [cardProportions, availableHeight, availableWidth]);

  return (
    <CardSizeProvider
      {...props}
      proportions={cardProportions}
      constraints={constraints}
    />
  );
}
