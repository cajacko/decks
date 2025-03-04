import React from "react";
import { Tabs, useNavigation, useLocalSearchParams } from "expo-router";
import { selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { store } from "@/store/store";
import text from "@/constants/text";
import IconSymbol from "@/components/IconSymbol";
import useFlag from "@/hooks/useFlag";
import { TabAnimationName } from "@react-navigation/bottom-tabs/lib/typescript/commonjs/src/types";

type NavOptions = {
  default?: React.ComponentProps<typeof Tabs>["screenOptions"];
  index?: React.ComponentProps<typeof Tabs.Screen>["options"];
  play?: React.ComponentProps<typeof Tabs.Screen>["options"];
};

export function getDeckName(deckId?: string | null) {
  return deckNameWithFallback(
    deckId &&
      selectDeck(store.getState(), {
        deckId,
      })?.name,
  );
}

function useSetDeckName(deckId: string | null) {
  const navigation = useNavigation();

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
}

export default function DeckLayout() {
  const params = useLocalSearchParams();
  const deckId = typeof params.deckId === "string" ? params.deckId : undefined;

  useSetDeckName(deckId ?? null);

  let animation: TabAnimationName = "none";

  switch (useFlag("NAVIGATION_TAB_ANIMATIONS")) {
    case "shift":
      animation = "shift";
      break;
    case "fade":
      animation = "fade";
      break;
  }

  const navOptions = React.useMemo(
    (): NavOptions => ({
      default: {
        animation,
        tabBarLabelPosition: "beside-icon",
        freezeOnBlur: true,
      },
      index: {
        headerShown: false,
        tabBarLabel: text["screen.deck.index.title"],
        tabBarIcon: ({ size }) => (
          <IconSymbol name="edit-document" size={size} />
        ),
      },
      play: {
        headerShown: false,
        tabBarLabel: text["screen.deck.play.title"],
        tabBarIcon: ({ size }) => <IconSymbol name="play-arrow" size={size} />,
      },
    }),
    [animation],
  );

  return (
    <Tabs
      backBehavior="history"
      detachInactiveScreens={true}
      screenOptions={navOptions.default}
    >
      <Tabs.Screen name="index" options={navOptions.index} />
      <Tabs.Screen name="play" options={navOptions.play} />
    </Tabs>
  );
}
