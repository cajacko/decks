import React from "react";
import { Tabs, useNavigation, useLocalSearchParams } from "expo-router";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { store } from "@/store/store";

export function getDeckName(deckId?: string | null) {
  return deckNameWithFallback(
    deckId &&
      selectDeck(store.getState(), {
        deckId,
      })?.name,
  );
}

export default function DeckLayout() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const deckId = typeof params.deckId === "string" ? params.deckId : undefined;

  React.useEffect(() => {
    let prevName = getDeckName(deckId);

    navigation.setOptions({
      headerTitle: prevName,
    });

    return store.subscribe(() => {
      const newName = getDeckName(deckId);

      if (newName === prevName) return;

      navigation.setOptions({
        headerTitle: newName,
      });

      prevName = newName;
    });
  }, [navigation, deckId]);

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        animation: "shift",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
          tabBarLabel: "Edit",
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          headerShown: false,
          animation: "none",
          tabBarLabel: "Play",
        }}
      />
    </Tabs>
  );
}
