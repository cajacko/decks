import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectDeckLastScreen, setLastScreen } from "@/store/slices/decks";
import { useFocusEffect } from "expo-router";

export default function useDeckLastScreen({
  deckId,
  screen,
}: {
  deckId: string;
  screen: "deck" | "play";
}) {
  const dispatch = useAppDispatch();
  const lastScreen = useAppSelector((state) =>
    selectDeckLastScreen(state, { deckId }),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (lastScreen === screen) return;

      dispatch(setLastScreen({ deckId, screen }));
    }, [dispatch, deckId, screen, lastScreen]),
  );

  return lastScreen;
}
