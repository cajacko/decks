import React from "react";
import { StyleSheet, View } from "react-native";
import DecksScreen, {
  DecksScreenSkeleton,
} from "@/components/decks/DecksScreen";
import { DeckScreenSkeleton } from "@/components/decks/DeckScreen";
import { TabletopSkeleton } from "@/components/tabletops/Tabletop";
import TextureBackground from "@/components/ui/TextureBackground";
import Screen from "@/components/ui/Screen";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useNavigation, ScreenProps } from "@/context/Navigation";
import MarketingScreen from "../marketing/MarketingScreen";

type ScreenKeys = ScreenProps["name"];

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

export default function Router(): React.ReactNode {
  const {
    screen: { name },
  } = useNavigation();
  const transitionProgress = useSharedValue(1);
  const currentScreen = useSharedValue<ScreenKeys>(name);
  const prevScreen = useSharedValue<ScreenKeys | null>(null);
  const screenRef = React.useRef<ScreenKeys | null>(null);

  React.useEffect(() => {
    const _prevScreen = screenRef.current;
    const _nextScreen = name;

    // This is init
    if (!prevScreen) {
      screenRef.current = _nextScreen;

      return;
    }

    transitionProgress.value = 0;
    prevScreen.value = _prevScreen;
    currentScreen.value = _nextScreen;

    transitionProgress.value = withTiming(1, { duration: 250 });
  }, [name, currentScreen, prevScreen, transitionProgress]);

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
        <AnimatedScreen
          transitionProgress={transitionProgress}
          currentScreen={currentScreen}
          prevScreen={prevScreen}
          screen="marketing"
        >
          <MarketingScreen style={styles.container} />
        </AnimatedScreen>
      </Screen>
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
