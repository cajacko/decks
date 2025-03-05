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
import { useColorScheme } from "@/hooks/useColorScheme";
import { ModalProvider } from "@/context/Modal";
import { navigationColors } from "@/constants/colors";
import { navigationFonts } from "@/components/ThemedText";
import { enableFreeze } from "react-native-screens";
import { AbrilFatface_400Regular } from "@expo-google-fonts/abril-fatface";
import { DrawerProvider } from "@/context/Drawer";

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

export function withApp(Component: React.ComponentType) {
  return function WithApp() {
    return (
      <App>
        <Component />
      </App>
    );
  };
}

export default function App({ children }: { children: React.ReactNode }) {
  const [loadedFonts] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Zain: AbrilFatface_400Regular,
  });

  const [loadedRedux, setLoadedRedux] = React.useState(false);

  const loaded = loadedFonts && loadedRedux;

  const onBeforeLift = React.useCallback(() => {
    setLoadedRedux(true);
  }, []);

  useEffect(() => {
    initMousePointer();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    SplashScreen.hideAsync();
  }, [loaded]);

  const navigationTheme = useNavigationTheme();

  if (!loadedFonts) {
    return null;
  }

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <ReduxProvider store={store}>
        <PersistGate
          loading={null}
          onBeforeLift={onBeforeLift}
          persistor={persistor}
        >
          <ModalProvider>
            <DrawerProvider>
              {children}
              <StatusBar style="auto" />
            </DrawerProvider>
          </ModalProvider>
        </PersistGate>
      </ReduxProvider>
    </NavigationThemeProvider>
  );
}
