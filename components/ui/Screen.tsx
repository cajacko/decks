import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { enteringDuration } from "@/hooks/useLayoutAnimations";
import { useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";
import useFlag from "@/hooks/useFlag";

export interface ScreenProps {
  children?: React.ReactNode;
  background?: React.ReactNode;
}

/**
 * Custom screen animation. Depending on our settings we either fade out a background that's placed
 * over the top or fade in the content.
 *
 * The fade out of the duplicated background is because react native applies opacity to all it's
 * children, which results in a strange translucent cross over effect. This is a workaround for
 * that. turn off in flags if it's a performance drain. Or just suck up the cross over effect.
 */
export default function Screen(props: ScreenProps): React.ReactNode {
  const navigation = useNavigation();
  const screenAnimations = useFlag("SCREEN_ANIMATIONS");

  const fadeOut = screenAnimations === "custom-fade-out-top-background";
  const fadeIn = screenAnimations === "custom-fade-in-content";

  const overlayOpacity = useSharedValue(fadeOut ? 1 : 0);
  const contentOpacity = useSharedValue(fadeIn ? 0 : 1);

  // NOTE: Using StyleSheet.flatten with animated styles didn't apply properly, so avoid that
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
      flex: 1,
      zIndex: 3,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      flex: 1,
      zIndex: 2,
      position: "relative",
    };
  });

  React.useEffect(() => {
    if (!fadeIn && !fadeOut) return;

    const blur = navigation.addListener("blur", () => {
      if (fadeIn) {
        contentOpacity.value = 0;
      }

      if (fadeOut) {
        overlayOpacity.value = 1;
      }
    });

    const focus = navigation.addListener("focus", () => {
      if (fadeIn) {
        contentOpacity.value = withTiming(1, { duration: enteringDuration });
      }

      if (fadeOut) {
        overlayOpacity.value = withTiming(0, { duration: enteringDuration });
      }
    });

    return () => {
      blur();
      focus();
    };
  }, [navigation, fadeIn, fadeOut, overlayOpacity, contentOpacity]);

  return (
    <View style={styles.container}>
      {fadeOut && (
        <Animated.View style={overlayStyle} pointerEvents="none">
          {props.background}
        </Animated.View>
      )}
      <Animated.View style={contentStyle}>{props.children}</Animated.View>
      <View style={styles.background}>{props.background}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  background: {
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
