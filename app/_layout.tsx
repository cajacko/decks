import { Stack } from "expo-router";
import React from "react";
import { getDeckName } from "@/app/deck/[deckId]/(tabs)/_layout";
import text from "@/constants/text";
import { withApp } from "@/components/App";
import useFlag from "@/hooks/useFlag";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

type NavOptions = {
  default?: React.ComponentProps<typeof Stack>["screenOptions"];
  index?: React.ComponentProps<typeof Stack.Screen>["options"];
  deck?: React.ComponentProps<typeof Stack.Screen>["options"];
};

function RootLayout() {
  const freezeOnBlur = useFlag("SCREENS_FREEZE_ON_BLUR");
  const animateStack = useFlag("NAVIGATION_STACK_ANIMATIONS") === "slide";

  const navOptions = React.useMemo(
    (): NavOptions => ({
      default: {
        freezeOnBlur,
      },
      index: {
        headerShown: true,
        headerBackVisible: false,
        headerTitle: text["screen.decks.title"],
        animation: animateStack ? "slide_from_left" : "none",
      },
      deck: ({ route: { params } }) => ({
        headerShown: true,
        headerTitle: getDeckName(
          params && "deckId" in params && typeof params.deckId === "string"
            ? params.deckId
            : null,
        ),
        animation: animateStack ? "slide_from_right" : "none",
      }),
    }),
    [animateStack, freezeOnBlur],
  );

  return (
    <Stack screenOptions={navOptions.default}>
      <Stack.Screen name="index" options={navOptions.index} />
      <Stack.Screen name="deck/[deckId]/(tabs)" options={navOptions.deck} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default withApp(RootLayout);
