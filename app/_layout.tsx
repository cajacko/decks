import { Stack } from "expo-router";
import React from "react";
import { getDeckName } from "@/app/deck/[deckId]/_layout";
import { withApp } from "@/components/ui/App";
import useFlag from "@/hooks/useFlag";
import HeaderLogo from "@/components/ui/HeaderLogo";
import AppStores from "@/components/ui/AppStores";
import ThemedView from "@/components/ui/ThemedView";
import { Platform, StyleSheet } from "react-native";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/forms/IconButton";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

type NavOptions = {
  default?: React.ComponentProps<typeof Stack>["screenOptions"];
  index?: React.ComponentProps<typeof Stack.Screen>["options"];
  deck?: React.ComponentProps<typeof Stack.Screen>["options"];
};

const closeIconSize = 40;

function RootLayout() {
  const freezeOnBlur = useFlag("SCREENS_FREEZE_ON_BLUR");
  const animateStack = useFlag("NAVIGATION_STACK_ANIMATIONS") === "slide";
  const borderColor = useThemeColor("inputOutline");
  const [showAppStore, setShowAppStore] = React.useState(true);

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
    <>
      <Stack screenOptions={navOptions.default}>
        {/* Only need to add items if defining options */}
        <Stack.Screen name="index" options={navOptions.index} />
        <Stack.Screen name="deck/[deckId]" options={navOptions.deck} />
      </Stack>
      {Platform.OS === "web" && showAppStore && (
        <ThemedView style={[styles.appStoreContainer, { borderColor }]}>
          <ContentWidth style={styles.inner}>
            <AppStores />
            <IconButton
              style={[styles.close, { borderColor }]}
              icon="close"
              onPress={() => setShowAppStore(false)}
              size={closeIconSize}
            />
          </ContentWidth>
        </ThemedView>
      )}
    </>
  );
}

const padding = 10;

const styles = StyleSheet.create({
  appStoreContainer: {
    justifyContent: "center",
    // alignItems: "center",
    padding,
    borderTopWidth: 1,
  },
  inner: {
    position: "relative",
  },
  close: {
    position: "absolute",
    right: padding,
    top: -(closeIconSize / 2 + padding),
    zIndex: 1,
    borderWidth: 1,
  },
});

export default withApp(RootLayout);
