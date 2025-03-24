import {
  ThemeProvider as NavigationThemeProvider,
  Theme as NavigationTheme,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { store, persistor } from "@/store/store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { init as initMousePointer } from "@/utils/mousePosition";
import useColorScheme from "@/hooks/useColorScheme";
import { ModalProvider } from "@/context/Modal";
import { navigationColors } from "@/constants/colors";
import { navigationFonts } from "@/components/ui/ThemedText";
import { enableFreeze } from "react-native-screens";
import { LuckiestGuy_400Regular } from "@expo-google-fonts/luckiest-guy";
import { Roboto_400Regular } from "@expo-google-fonts/roboto";
import { DrawerProvider } from "@/context/Drawer";
import useFlag from "@/hooks/useFlag";
import { useHasRehydrated } from "@/store/hooks";
import registerExampleDecks from "@/utils/registerExampleDecks";

enableFreeze();
registerExampleDecks();

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

function HasStore({ children }: { children: React.ReactNode }) {
  const navigationTheme = useNavigationTheme();
  const [loadedFonts] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto: Roboto_400Regular,
    LuckiestGuy: LuckiestGuy_400Regular,
  });

  const [isStoreReady, setIsStoreReady] = React.useState(false);
  const hasRehydrated = useHasRehydrated();
  const shouldPurgeStoreOnStart = useFlag("PURGE_STORE_ON_START");

  React.useEffect(() => {
    if (!hasRehydrated) return;

    if (shouldPurgeStoreOnStart) {
      persistor.purge().finally(() => {
        setIsStoreReady(true);
      });

      return;
    }

    setIsStoreReady(true);
  }, [hasRehydrated, shouldPurgeStoreOnStart]);

  const loaded = loadedFonts && isStoreReady;

  useEffect(() => {
    initMousePointer();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    SplashScreen.hideAsync();
  }, [loaded]);

  if (!loadedFonts) {
    return null;
  }

  return (
    <PersistGate loading={null} persistor={persistor}>
      <NavigationThemeProvider value={navigationTheme}>
        <ModalProvider>
          <DrawerProvider>
            {children}
            <StatusBar style="auto" />
          </DrawerProvider>
        </ModalProvider>
      </NavigationThemeProvider>
    </PersistGate>
  );
}

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <HasStore>{children}</HasStore>
    </ReduxProvider>
  );
}

export function withApp(Component: React.ComponentType) {
  return function WithApp() {
    return (
      <App>
        <Component />
      </App>
    );
  };
}
