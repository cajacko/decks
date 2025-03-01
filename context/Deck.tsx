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

export function DeckCardSizeProvider({
  id,
  idType,
  ...props
}: Omit<CardSizeProviderProps, "proportions"> & {
  id: string;
  idType: "deck" | "card";
}) {
  const cardProportions = useCardProportions({ id, idType });

  return <CardSizeProvider proportions={cardProportions} {...props} />;
}
