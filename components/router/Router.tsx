import React from "react";
import { Platform, StyleSheet } from "react-native";
import DecksScreen from "@/components/decks/DecksScreen";
import DeckScreen, { DeckScreenSkeleton } from "@/components/decks/DeckScreen";
import TabletopScreen, {
  TabletopSkeleton,
} from "@/components/tabletops/Tabletop";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import { useNavigation } from "@/context/Navigation";
import MarketingScreen from "../marketing/MarketingScreen";
import Tabs from "../ui/Tabs";
import Preload from "./Preload";

export default React.memo(function Router(): React.ReactNode {
  const {
    screen: { name, deckId: _deckId },
    preloadDeckId,
  } = useNavigation();

  const deckId = _deckId ?? preloadDeckId;

  return (
    <Screen background={<TextureBackground />}>
      <Preload
        visible={name === "decks"}
        behaviour={
          Platform.OS === "web" ? "no-preload" : "keep-children-mounted"
        }
        style={styles.absolute}
        renderKey="decks"
      >
        <DecksScreen style={styles.container} />
      </Preload>
      <Preload
        visible={name === "deck" || name === "play"}
        behaviour={
          Platform.OS === "web" ? "no-preload" : "keep-children-mounted"
        }
        style={styles.absolute}
        renderKey="deckLayout"
      >
        <Tabs>
          <Preload
            loader={<DeckScreenSkeleton style={styles.container} />}
            visible={name === "deck"}
            behaviour={
              Platform.OS === "web"
                ? "no-preload"
                : "optimise-mount-unmount-with-loader"
            }
            style={styles.absolute}
            renderKey={`deck-${deckId}`}
          >
            {deckId && <DeckScreen deckId={deckId} style={styles.container} />}
          </Preload>
          <Preload
            loader={<TabletopSkeleton style={styles.container} />}
            visible={name === "play"}
            behaviour={
              Platform.OS === "web"
                ? "no-preload"
                : "optimise-mount-unmount-with-loader"
            }
            style={styles.absolute}
            renderKey={`play-${deckId}`}
          >
            {deckId && (
              <TabletopScreen deckId={deckId} style={styles.container} />
            )}
          </Preload>
        </Tabs>
      </Preload>
      <Preload
        visible={name === "marketing"}
        behaviour="no-preload"
        style={styles.absolute}
        renderKey="marketing"
      >
        <MarketingScreen style={styles.container} />
      </Preload>
    </Screen>
  );
});

const styles = StyleSheet.create({
  tabs: {
    position: "relative",
    zIndex: 2,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: "relative",
  },
  hide: {
    transform: [
      {
        translateX: 99999999,
      },
    ],
  },
  absolute: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
