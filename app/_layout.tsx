import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { store, persistor } from "@/store/store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { init as initMousePointer } from "@/utils/mousePosition";
import { useColorScheme } from "@/expoExample/hooks/useColorScheme";
import { getDeckName } from "@/app/deck/[deckId]/_layout";
import { ModalProvider } from "@/context/Modal";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
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

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ModalProvider>
            <Stack
              screenOptions={{
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: true,
                  headerBackButtonMenuEnabled: false,
                  headerTitle: "Decks",
                }}
              />
              <Stack.Screen
                name="deck/[deckId]"
                options={({ route: { params } }) => ({
                  headerShown: true,
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
        </PersistGate>
      </ReduxProvider>
    </ThemeProvider>
  );
}
