import Tabletop from "@/components/Tabletop/Tabletop";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import AppError from "@/classes/AppError";
import { useAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/slices/decks";
import { useNavigation } from "expo-router";
import TextureBackground from "@/components/TextureBackground";
import Screen from "@/components/Screen";

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckTabletopScreen() {
  const params = useLocalSearchParams();
  const deckIdParam = params[paramKeys.deckId];
  const navigation = useNavigation();
  const deckId = typeof deckIdParam === "string" ? deckIdParam : null;

  const defaultTabletopId = useAppSelector((state) =>
    deckId ? selectDeck(state, { deckId })?.defaultTabletopId : undefined,
  );

  if (!defaultTabletopId || !deckId) {
    if (navigation.isFocused()) {
      new AppError(
        `${DeckTabletopScreen.name}: no deckId or defaultTabletopId found`,
      ).log("error");
    }

    return null;
  }

  return (
    <Screen background={<TextureBackground />}>
      <Tabletop tabletopId={defaultTabletopId} deckId={deckId} />
    </Screen>
  );
}
