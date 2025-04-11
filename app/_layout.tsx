import { Stack, usePathname } from "expo-router";
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

type NavOptions = {
  default?: React.ComponentProps<typeof Stack>["screenOptions"];
  app?: React.ComponentProps<typeof Stack.Screen>["options"];
  marketing?: React.ComponentProps<typeof Stack.Screen>["options"];
  deck?: React.ComponentProps<typeof Stack.Screen>["options"];
};

const closeIconSize = 40;

function RootLayout() {
  const freezeOnBlur = useFlag("SCREENS_FREEZE_ON_BLUR");
  const animateStack = useFlag("NAVIGATION_STACK_ANIMATIONS") === "slide";
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
    () => ({
      default: {
        freezeOnBlur,
        headerShown: false,
      },
      app: {
        animation: animateStack ? "slide_from_left" : "none",
      },
      marketing: {
        animation: "none",
      },
      deck: () => ({
        animation: animateStack ? "slide_from_right" : "none",
      }),
    }),
    [animateStack, freezeOnBlur],
  );

  return (
    <>
      <Stack screenOptions={navOptions.default}>
        {/* Only need to add items if defining options */}
        <Stack.Screen
          name="index"
          options={
            Platform.OS === "web" ? navOptions.marketing : navOptions.app
          }
        />
        <Stack.Screen name="app" options={navOptions.app} />
        <Stack.Screen name="deck/[deckId]" options={navOptions.deck} />
      </Stack>
      {Platform.OS === "web" && showAppStore && pathname !== "/" && (
        <ThemedView style={[styles.appStoreContainer, { borderColor }]}>
          <ContentWidth style={styles.inner}>
            <AppStores />
            <IconButton
              style={styles.close}
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
  },
});

export default withApp(RootLayout);
