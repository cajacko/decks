import {
  ThemeProvider as NavigationThemeProvider,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { store, persistor } from "@/store/store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { init as initMousePointer } from "@/utils/mousePosition";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getDeckName } from "@/app/deck/[deckId]/_layout";
import { ModalProvider } from "@/context/Modal";
import text from "@/constants/text";
import { navigationColors } from "@/constants/colors";
import { navigationFonts } from "@/components/ThemedText";
import TextureBackground from "@/components/TextureBackground";
import { enableFreeze } from "react-native-screens";

enableFreeze();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

function useNavigationTheme(): NavigationTheme {
  const colorScheme = useColorScheme();

  return React.useMemo((): NavigationTheme => {
    if (colorScheme === "light") {
      return {
        dark: false,
        fonts: navigationFonts,
        colors: navigationColors.light,
      };
    }

    return {
      dark: true,
      fonts: navigationFonts,
      colors: navigationColors.dark,
    };
  }, [colorScheme]);
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    initMousePointer();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const navigationTheme = useNavigationTheme();

  if (!loaded) {
    return null;
  }

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TextureBackground>
            <ModalProvider>
              <Stack
                screenOptions={{
                  freezeOnBlur: true,
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{
                    headerShown: true,
                    headerBackButtonMenuEnabled: false,
                    animation: "slide_from_left",
                    headerTitle: text["screen.decks.title"],
                  }}
                />
                <Stack.Screen
                  name="deck/[deckId]"
                  options={({ route: { params } }) => ({
                    headerShown: true,
                    animation: "slide_from_right",
                    headerTitle: getDeckName(
                      params &&
                        "deckId" in params &&
                        typeof params.deckId === "string"
                        ? params.deckId
                        : null,
                    ),
                  })}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ModalProvider>
          </TextureBackground>
        </PersistGate>
      </ReduxProvider>
    </NavigationThemeProvider>
  );
}
