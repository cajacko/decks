import { Stack } from "expo-router";
import React from "react";
import { getDeckName } from "@/app/deck/[deckId]/_layout";
import { withApp } from "@/components/ui/App";
import useFlag from "@/hooks/useFlag";
import HeaderLogo from "@/components/ui/HeaderLogo";

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

  const navOptions: NavOptions = React.useMemo(
    () => ({
      default: {
        freezeOnBlur,
      },
      index: {
        headerShown: true,
        headerBackVisible: false,
        headerTitle: HeaderLogo,
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
      {/* Only need to add items if defining options */}
      <Stack.Screen name="index" options={navOptions.index} />
      <Stack.Screen name="deck/[deckId]" options={navOptions.deck} />
    </Stack>
  );
}

export default withApp(RootLayout);
