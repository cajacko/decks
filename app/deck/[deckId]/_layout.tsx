import React from "react";
import { Tabs, useNavigation, useLocalSearchParams } from "expo-router";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { store } from "@/store/store";
import text from "@/constants/text";
import IconSymbol from "@/components/IconSymbol";

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
      detachInactiveScreens={false}
      screenOptions={{
        animation: "none",
        tabBarLabelPosition: "beside-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: text["screen.deck.index.title"],
          tabBarIcon: ({ size }) => (
            <IconSymbol name="edit-document" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          headerShown: false,
          tabBarLabel: text["screen.deck.play.title"],
          tabBarIcon: ({ size }) => (
            <IconSymbol name="play-arrow" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
