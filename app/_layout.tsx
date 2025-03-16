import { Stack } from "expo-router";
import React from "react";
import { getDeckName } from "@/app/deck/[deckId]/(tabs)/_layout";
import text from "@/constants/text";
import { withApp } from "@/components/App";
import useFlag from "@/hooks/useFlag";
import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";
import { useTextLogo } from "@/hooks/useLogo";

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
  const logo = useTextLogo();

  const navOptions = React.useMemo(
    (): NavOptions => ({
      default: {
        freezeOnBlur,
      },
      index: {
        headerShown: true,
        headerBackVisible: false,
        headerTitle: () => (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              contentFit="contain"
              contentPosition="left center"
              source={logo}
            />
          </View>
        ),
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
    [animateStack, freezeOnBlur, logo],
  );

  return (
    <Stack screenOptions={navOptions.default}>
      <Stack.Screen name="index" options={navOptions.index} />
      <Stack.Screen name="deck/[deckId]/(tabs)" options={navOptions.deck} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    height: "100%",
    width: 200,
  },
  image: {
    flex: 1,
    width: "100%",
    marginLeft: Platform.OS === "web" ? -30 : 60,
    transform: [{ scale: Platform.OS === "web" ? 0.8 : 1.7 }],
  },
});

export default withApp(RootLayout);
