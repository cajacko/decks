import React from "react";
import { Tabs, useNavigation, useGlobalSearchParams } from "expo-router";
import { selectCanEditDeck, selectDeck } from "@/store/slices/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { store } from "@/store/store";
import text from "@/constants/text";
import IconSymbol from "@/components/IconSymbol";
import useFlag from "@/hooks/useFlag";
import { TabAnimationName } from "@react-navigation/bottom-tabs/lib/typescript/commonjs/src/types";
import { useAppSelector } from "@/store/hooks";

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

export const paramKeys = {
  deckId: "deckId",
};

export default function DeckLayout() {
  // Getting the global search ones are key here. We had an issue when navigating between decks
  // where the local search params would retain the previous deckId, adding this and the href props
  // in the navOptions fixed the issue
  const params = useGlobalSearchParams();
  const deckIdParam = params[paramKeys.deckId];
  const deckId = typeof deckIdParam === "string" ? deckIdParam : undefined;
  const canEditDeck = useAppSelector((state) =>
    deckId ? selectCanEditDeck(state, { deckId }) : false,
  );

  useSetDeckName(deckId ?? null);

  const freezeOnBlur = useFlag("SCREENS_FREEZE_ON_BLUR");

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
        freezeOnBlur,
      },
      index: {
        headerShown: false,
        tabBarLabel: canEditDeck
          ? text["screen.deck.index.title"]
          : text["screen.deck.view.title"],
        tabBarIcon: ({ size }) => (
          <IconSymbol
            name={canEditDeck ? "edit-document" : "remove-red-eye"}
            size={size}
          />
        ),
        href: deckId
          ? {
              pathname: "/deck/[deckId]/(tabs)",
              params: {
                deckId,
              },
            }
          : undefined,
      },
      play: {
        headerShown: false,
        tabBarLabel: text["screen.deck.play.title"],
        tabBarIcon: ({ size }) => <IconSymbol name="play-arrow" size={size} />,
        href: deckId
          ? {
              pathname: "/deck/[deckId]/(tabs)/play",
              params: {
                deckId,
              },
            }
          : undefined,
      },
    }),
    [animation, freezeOnBlur, canEditDeck, deckId],
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
