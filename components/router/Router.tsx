import React from "react";
import { StyleSheet, View } from "react-native";
import DecksScreen, {
  DecksScreenSkeleton,
} from "@/components/decks/DecksScreen";
import { DeckScreenSkeleton } from "@/components/decks/DeckScreen";
import { TabletopSkeleton } from "@/components/tabletops/Tabletop";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import Tabs, { Tab } from "@/components/ui/Tabs";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface RouterProps {}

type ScreenKeys = "decks" | "deck" | "play";

function AnimatedScreen(props: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  transitionProgress: SharedValue<number>;
  currentScreen: SharedValue<ScreenKeys>;
  prevScreen: SharedValue<ScreenKeys | null>;
  screen: ScreenKeys;
}): React.ReactNode {
  const { currentScreen, prevScreen, screen, transitionProgress } = props;

  const visibility = useDerivedValue<number>(() => {
    if (prevScreen.value !== screen && currentScreen.value !== screen) return 0;
    if (prevScreen.value === screen && currentScreen.value === screen) return 1;

    if (currentScreen.value === screen) {
      return transitionProgress.value;
    }

    return 0;
    // return 1 - transitionProgress.value;
  }, [screen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: visibility.value,
      transform: [
        {
          translateY: visibility.value === 0 ? 100 : 1,
        },
      ],
    };
  });

  const style = React.useMemo(
    () => [styles.animated, animatedStyle],
    [animatedStyle],
  );

  return <Animated.View style={style}>{props.children}</Animated.View>;
}

// type NavState = {
//   screen: ScreenKeys;
//   prevScreen: ScreenKeys | null;
//   deckId: string | null;
// };

export default function Router(props: RouterProps): React.ReactNode {
  const transitionProgress = useSharedValue(1);
  // const [navState, setNavState] = React.useState<NavState>({
  //   screen: "decks",
  //   prevScreen: null,
  //   deckId: null,
  // });
  const currentScreen = useSharedValue<ScreenKeys>("decks");
  const prevScreen = useSharedValue<ScreenKeys | null>("decks");

  const withOnPress = React.useCallback(
    (screen: ScreenKeys) => () => {
      transitionProgress.value = 0;
      prevScreen.value = currentScreen.value;
      currentScreen.value = screen;

      transitionProgress.value = withTiming(1, { duration: 250 });
    },
    [transitionProgress, currentScreen, prevScreen],
  );

  const onPressHome = React.useMemo(() => withOnPress("decks"), [withOnPress]);
  const onPressView = React.useMemo(() => withOnPress("deck"), [withOnPress]);
  const onPressPlay = React.useMemo(() => withOnPress("play"), [withOnPress]);

  return (
    <View style={styles.content}>
      <Screen background={<TextureBackground />}>
        <AnimatedScreen
          transitionProgress={transitionProgress}
          currentScreen={currentScreen}
          prevScreen={prevScreen}
          screen="decks"
          skeleton={<DecksScreenSkeleton style={styles.container} />}
        >
          <DecksScreen style={styles.container} />
        </AnimatedScreen>
        <AnimatedScreen
          transitionProgress={transitionProgress}
          currentScreen={currentScreen}
          prevScreen={prevScreen}
          screen="deck"
        >
          <DeckScreenSkeleton style={styles.container} />
        </AnimatedScreen>
        <AnimatedScreen
          transitionProgress={transitionProgress}
          currentScreen={currentScreen}
          prevScreen={prevScreen}
          screen="play"
        >
          <TabletopSkeleton style={styles.container} />
        </AnimatedScreen>
      </Screen>
      <Tabs style={styles.tabs}>
        <Tab icon="home" title="Home" isActive={true} onPress={onPressHome} />
        <Tab
          icon="remove-red-eye"
          title="View"
          isActive={false}
          onPress={onPressView}
        />
        <Tab
          icon="play-arrow"
          title="Play"
          isActive={false}
          onPress={onPressPlay}
        />
      </Tabs>
    </View>
  );
}

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
  animated: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
