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
import { ContainerSizeProvider } from "@/context/ContainerSize";
import Toolbar from "@/components/toolbars/Toolbar";
import Notifications from "@/components/ui/Notifications";

export default React.memo(function Router({
  onLoad,
}: {
  onLoad?: () => void;
}): React.ReactNode {
  const {
    screen: { name, deckId: _deckId },
    preloadDeckId,
  } = useNavigation();
  const waitForRef = React.useRef<string[]>([]);
  const onLoadRef = React.useRef(onLoad);
  onLoadRef.current = onLoad;

  const deckId = _deckId ?? preloadDeckId;

  const withRegisterOnLoad = React.useCallback((key: string) => {
    waitForRef.current.push(key);

    return () => {
      if (waitForRef.current.includes(key)) {
        waitForRef.current = waitForRef.current.filter((k) => k !== key);
      }

      if (waitForRef.current.length === 0 && onLoadRef.current) {
        onLoadRef.current();
      }
    };
  }, []);

  const onLoadContainer = React.useMemo(
    () => withRegisterOnLoad("container"),
    [withRegisterOnLoad],
  );

  const onLoadDecks = React.useMemo(
    () => withRegisterOnLoad("decks"),
    [withRegisterOnLoad],
  );

  return (
    <>
      {name !== "marketing" && <Toolbar />}
      <Notifications>
        <Screen background={<TextureBackground />}>
          <ContainerSizeProvider
            onLoad={onLoadContainer}
            style={styles.container}
            hideUntilLoaded
          >
            <Preload
              visible={name === "decks"}
              behaviour={
                Platform.OS === "web" ? "no-preload" : "keep-children-mounted"
              }
              style={styles.absolute}
              renderKey="decks"
              onPreloaded={onLoadDecks}
            >
              <DecksScreen style={styles.container} />
            </Preload>
            <Preload
              visible={name === "marketing"}
              behaviour="no-preload"
              style={styles.absolute}
              renderKey="marketing"
            >
              <MarketingScreen style={styles.container} />
            </Preload>
          </ContainerSizeProvider>
          <Preload
            visible={name === "deck" || name === "play"}
            behaviour={
              Platform.OS === "web" ? "no-preload" : "keep-children-mounted"
            }
            style={styles.absolute}
            renderKey="deckLayout"
          >
            <Tabs>
              <ContainerSizeProvider style={styles.container} hideUntilLoaded>
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
                  {deckId && (
                    <DeckScreen deckId={deckId} style={styles.container} />
                  )}
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
              </ContainerSizeProvider>
            </Tabs>
          </Preload>
        </Screen>
      </Notifications>
    </>
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
