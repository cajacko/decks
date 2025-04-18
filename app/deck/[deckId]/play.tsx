import Tabletop, { TabletopSkeleton } from "@/components/tabletops/Tabletop";
import React from "react";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import { useNavigation } from "@/context/Navigation";

export default function DeckTabletopScreen() {
  const { screen, preloadDeckId } = useNavigation();
  const deckId = screen.deckId ?? preloadDeckId;

  return (
    <Screen background={<TextureBackground />}>
      {deckId ? <Tabletop deckId={deckId} /> : <TabletopSkeleton />}
    </Screen>
  );
}
