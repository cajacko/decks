import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setLastScreen } from "@/store/slices/decks";
import { selectDeckLastScreen } from "@/store/selectors/decks";
import { useFocusEffect } from "expo-router";

export default function useDeckLastScreen({
  deckId,
  screen,
}: {
  deckId: string | null;
  screen: "deck" | "play";
}) {
  const dispatch = useAppDispatch();
  const lastScreen = useAppSelector((state) =>
    deckId ? selectDeckLastScreen(state, { deckId }) : undefined,
  );

  useFocusEffect(
    React.useCallback(() => {
      if (!deckId) return;
      if (lastScreen === screen) return;

      dispatch(setLastScreen({ deckId, screen }));
    }, [dispatch, deckId, screen, lastScreen]),
  );

  return lastScreen;
}
