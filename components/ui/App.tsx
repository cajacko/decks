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
import useApplyUpdateAlert from "@/hooks/useApplyUpdateAlert";
import { SyncProvider } from "@/context/Sync";
import { AuthenticationProvider } from "@/context/Authentication";
import useIsSafeAreaContextReady from "@/hooks/useIsSafeAreaContextReady";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SkeletonProvider } from "@/context/Skeleton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { NavigationProvider } from "@/context/Navigation";
import Router from "../router/Router";
import { PerformanceMonitorProvider } from "@/context/PerformanceMonitor";
import { GlobalLoadingProvider } from "@/context/GlobalLoading";
import { NotificationProvider } from "@/context/Notifications";
import { StackListRefsProvider } from "@/context/StackListRefs";

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

function Content({
  children,
  onLoad,
}: {
  children: React.ReactNode;
  onLoad?: () => void;
}) {
  const { component } = useApplyUpdateAlert({
    autoCheck: true,
  });

  return (
    <>
      {component}
      <Router onLoad={onLoad} />
    </>
  );
}

function HasStore({ children }: { children: React.ReactNode }) {
  const navigationTheme = useNavigationTheme();
  const [loadedFonts] = useFonts({
    Roboto: Roboto_400Regular,
    LuckiestGuy: LuckiestGuy_400Regular,
  });

  const isSafeAreaReady = useIsSafeAreaContextReady({
    timeout: 2000,
    timeoutWithoutChange: 1500,
  });

  const [isStoreReady, setIsStoreReady] = React.useState(false);
  const [hasContentLoaded, setHasContentLoaded] = React.useState(false);
  const hasRehydrated = useHasRehydrated();
  const shouldPurgeStoreOnStart = useFlag("PURGE_STORE_ON_START");
  const scheme = useColorScheme();

  const onContentLoad = React.useCallback(() => {
    setHasContentLoaded(true);
  }, []);

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

  const loaded =
    loadedFonts && isStoreReady && isSafeAreaReady && hasContentLoaded;

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
      <GlobalLoadingProvider>
        <NavigationProvider>
          <NavigationThemeProvider value={navigationTheme}>
            <NotificationProvider>
              <AuthenticationProvider>
                <SyncProvider>
                  <SkeletonProvider>
                    <StackListRefsProvider>
                      <ModalProvider>
                        <DrawerProvider>
                          <Content onLoad={onContentLoad}>{children}</Content>
                          <StatusBar
                            style={scheme === "dark" ? "light" : "dark"}
                          />
                        </DrawerProvider>
                      </ModalProvider>
                    </StackListRefsProvider>
                  </SkeletonProvider>
                </SyncProvider>
              </AuthenticationProvider>
            </NotificationProvider>
          </NavigationThemeProvider>
        </NavigationProvider>
      </GlobalLoadingProvider>
    </PersistGate>
  );
}

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceMonitorProvider>
      <GestureHandlerRootView style={style.flex}>
        <SafeAreaProvider style={style.flex}>
          <ReduxProvider store={store}>
            <HasStore>{children}</HasStore>
          </ReduxProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </PerformanceMonitorProvider>
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

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
