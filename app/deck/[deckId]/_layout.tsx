import React from "react";
import { useSegments, Tabs } from "expo-router";
import { selectCanEditDeck } from "@/store/selectors/decks";
import text from "@/constants/text";
import { useAppSelector } from "@/store/hooks";
import useScreenDeckId from "@/hooks/useScreenDeckId";
import { StyleSheet, View } from "react-native";
import UITabs, { Tab as UITab } from "@/components/ui/Tabs";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";

const tabBar = () => null;

export default function DeckLayout() {
  const isFocused = useIsFocused();
  const deckId = useScreenDeckId("layout", null);

  // TODO: Use is focussed to render the skeleton or not
  // console.log("DeckLayout", { deckId, isFocused });

  const canEditDeck = useAppSelector((state) =>
    deckId ? selectCanEditDeck(state, { deckId }) : false,
  );

  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const isPlay = lastSegment === "play";

  const screenOptions = React.useMemo<BottomTabNavigationOptions>(() => {
    return {
      headerShown: false,
      tabBarStyle: { display: "none" },
      lazy: true, // false = renders everything in the tab when nav loads
      // freezeOnBlur: true,
      animation: "none",
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Tabs
          detachInactiveScreens={false}
          initialRouteName="index"
          tabBar={tabBar}
          screenOptions={screenOptions}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="play" />
        </Tabs>
      </View>
      <UITabs style={styles.tabs}>
        <UITab
          href={`/deck/${deckId}`}
          icon={canEditDeck ? "edit-document" : "remove-red-eye"}
          title={
            canEditDeck
              ? text["screen.deck.index.title"]
              : text["screen.deck.view.title"]
          }
          isActive={!isPlay}
        />
        <UITab
          href={`/deck/${deckId}/play`}
          icon="play-arrow"
          title={text["screen.deck.play.title"]}
          isActive={isPlay}
        />
      </UITabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
});
