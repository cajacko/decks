import Tabletop from "@/components/tabletops/Tabletop";
import React from "react";
import AppError from "@/classes/AppError";
import { useAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/selectors/decks";
import { useNavigation } from "expo-router";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import useScreenDeckId from "@/hooks/useScreenDeckId";

export default function DeckTabletopScreen() {
  const navigation = useNavigation();
  const deckId = useScreenDeckId("screen", null);

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
