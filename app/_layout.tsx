import { usePathname, Tabs } from "expo-router";
import React from "react";
import { withApp } from "@/components/ui/App";
import useFlag from "@/hooks/useFlag";
import AppStores from "@/components/ui/AppStores";
import ThemedView from "@/components/ui/ThemedView";
import { Platform, StyleSheet } from "react-native";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "@/components/forms/IconButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUserSetting, setUserSetting } from "@/store/slices/userSettings";
import { dateToDateString } from "@/utils/dates";

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: Platform.OS === "web" ? "app" : "index",
};

const tabBar = () => null;

type NavOptions = {
  default?: React.ComponentProps<typeof Tabs>["screenOptions"];
  app?: React.ComponentProps<typeof Tabs.Screen>["options"];
  marketing?: React.ComponentProps<typeof Tabs.Screen>["options"];
  deck?: React.ComponentProps<typeof Tabs.Screen>["options"];
};

const closeIconSize = 40;

function RootLayout() {
  const freezeOnBlur = useFlag("SCREENS_FREEZE_ON_BLUR");
  // const animateStack = useFlag("NAVIGATION_STACK_ANIMATIONS") === "slide";
  const borderColor = useThemeColor("inputOutline");
  const pathname = usePathname();

  const hideWebAppStorePopUp = useAppSelector((state) =>
    selectUserSetting(state, { key: "hideWebAppStorePopUp" }),
  );

  const [showAppStore, setShowAppStore] = React.useState(
    hideWebAppStorePopUp === true ? false : true,
  );

  const dispatch = useAppDispatch();

  const closeAppStorePopUp = React.useCallback(() => {
    setShowAppStore(false);

    dispatch(
      setUserSetting({
        key: "hideWebAppStorePopUp",
        value: true,
        date: dateToDateString(new Date()),
      }),
    );
  }, [dispatch]);

  const navOptions: NavOptions = React.useMemo(
    (): NavOptions => ({
      default: {
        freezeOnBlur,
        headerShown: false,
        tabBarStyle: { display: "none" },
        lazy: true, // false = renders everything in the tab when nav loads
        // headerShown: false,
        animation: "none",
      },
      app: {
        freezeOnBlur: true,
        // animation: animateStack ? "slide_from_left" : "none",
        // animation: "shift",
      },
      marketing: {
        animation: "none",
      },
      deck: () => ({
        freezeOnBlur: false,
        // animation: animateStack ? "slide_from_right" : "none",
      }),
    }),
    [freezeOnBlur],
  );

  return (
    <>
      <Tabs
        initialRouteName={unstable_settings.initialRouteName}
        tabBar={tabBar}
        detachInactiveScreens={false}
        screenOptions={navOptions.default}
      >
        {/* Only need to add items if defining options */}
        <Tabs.Screen
          name="index"
          options={
            Platform.OS === "web" ? navOptions.marketing : navOptions.app
          }
        />
        <Tabs.Screen name="app" options={navOptions.app} />
        <Tabs.Screen
          name="deck/[deckId]"
          options={navOptions.deck}
          initialParams={{}}
        />
      </Tabs>
      {Platform.OS === "web" && showAppStore && pathname !== "/" && (
        <ThemedView style={[styles.appStoreContainer, { borderColor }]}>
          <ContentWidth style={styles.inner}>
            <AppStores />
            <IconButton
              style={[styles.close, { borderColor }]}
              icon="close"
              onPress={closeAppStorePopUp}
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
