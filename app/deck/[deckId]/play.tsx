import Tabletop, { TabletopSkeleton } from "@/components/tabletops/Tabletop";
import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectDeck } from "@/store/selectors/decks";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import useScreenDeckId from "@/hooks/useScreenDeckId";
import useScreenSkeleton from "@/hooks/useScreenSkeleton";

export default function DeckTabletopScreen() {
  let skeleton = useScreenSkeleton(DeckTabletopScreen.name);
  const deckId = useScreenDeckId("screen", null);

  const defaultTabletopId = useAppSelector((state) =>
    deckId ? selectDeck(state, { deckId })?.defaultTabletopId : undefined,
  );

  let props: { deckId: string; defaultTabletopId: string } | null = null;

  if (deckId && defaultTabletopId) {
    props = { deckId, defaultTabletopId };
  }

  if (skeleton) {
    props = null;
  } else if ([].length === 0) {
    props = null;
  }

  return (
    <Screen background={<TextureBackground />}>
      {!props ? (
        <TabletopSkeleton />
      ) : (
        <Tabletop tabletopId={props.defaultTabletopId} deckId={props.deckId} />
      )}
    </Screen>
  );
}
