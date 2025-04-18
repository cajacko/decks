import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useDrawer } from "@/context/Drawer";
import ProfilePic from "@/components/ui/ProfilePic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, appHome } from "@/context/Navigation";
import Image from "@/components/ui/Image";
import { useTextLogo } from "@/hooks/useLogo";
import IconButton from "@/components/forms/IconButton";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFlag from "@/hooks/useFlag";
import { useSkeletonAnimation } from "@/context/Skeleton";
import { TouchableOpacity } from "@/components/ui/Pressables";
import { useAuthentication } from "@/context/Authentication";
import useDeckName from "@/hooks/useDeckName";
import { useIsGlobalLoading } from "@/context/GlobalLoading";
import TabletopToolbar from "./TabletopToolbar";
import { _contentHeight, styles, iconSize, imageHeight } from "./toolbar.style";

export interface ToolbarProps {
  title?: string | null;
  logoVisible?: boolean;
  children?: React.ReactNode | null;
  back?: boolean;
  loading?: boolean;
}

function useToolbarHeight() {
  const paddingTop = useSafeAreaInsets().top;
  const height = _contentHeight + paddingTop;

  return {
    paddingTop,
    height,
    contentHeight: _contentHeight,
  };
}

export default React.memo(function Toolbar() {
  let { height, paddingTop } = useToolbarHeight();
  const hidden = useNavigation().screen.name === "marketing";
  const loading = useIsGlobalLoading("toolbar");

  if (hidden) {
    height = 0;
  }

  const {
    screen: { name, deckId },
    navigate,
  } = useNavigation();
  const showLogo = name === appHome;

  const goBack = React.useMemo(
    () => (showLogo ? null : () => navigate({ name: appHome })),
    [showLogo, navigate],
  );

  let title: string | null = useDeckName(deckId);

  if (!deckId) {
    title = null;
  }

  const { isLoggedIn } = useAuthentication();
  const { entering, exiting } = useLayoutAnimations();
  const { open } = useDrawer() ?? {};
  const { source, aspectRatio } = useTextLogo();
  const borderBottomColor = useThemeColor("inputOutline");
  const backgroundColor = useThemeColor("background");
  const primaryColor = useThemeColor("primary");
  const { loopAnimation } = useSkeletonAnimation() ?? {};
  const loadingOpacity = useSharedValue(loading ? 1 : 0);
  const shouldAnimateLoading =
    useFlag("TOOLBAR_LOADING_ANIMATION") === "enabled";

  React.useEffect(() => {
    if (!shouldAnimateLoading) return;

    loadingOpacity.value = withTiming(loading ? 1 : 0, {
      duration: 300,
    });
  }, [loading, shouldAnimateLoading, loadingOpacity]);

  const containerStyle = React.useMemo(
    () => [
      styles.container,
      {
        paddingTop,
        height,
        maxHeight: height,
        borderBottomColor,
        backgroundColor,
      },
    ],
    [height, borderBottomColor, paddingTop, backgroundColor],
  );

  const imageContainerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.imageContainer,
        { height: imageHeight, width: imageHeight * aspectRatio },
      ]),
    [aspectRatio],
  );

  const loadingPositionStyle = useAnimatedStyle(() => {
    const width = 10;
    const midPosition = 50 - width / 2;

    if (!shouldAnimateLoading || !loopAnimation) return {};

    return {
      opacity: loadingOpacity.value,
      left: `${interpolate(loopAnimation.value, [0, 0.1, 0.5, 1], [0, 0, midPosition, 100])}%`,
      right: `${interpolate(loopAnimation.value, [0, 0.5, 0.9, 1], [100, midPosition, 0, 0])}%`,
    };
  });

  const loadingProgressStyle = React.useMemo(
    () => [
      styles.progress,
      { backgroundColor: primaryColor },
      loadingPositionStyle,
    ],
    [loadingPositionStyle, primaryColor],
  );

  return (
    <View style={containerStyle}>
      <ContentWidth
        padding="standard"
        style={styles.contentWidth}
        contentContainerStyle={styles.contentWidth}
      >
        <View style={styles.content}>
          {goBack && (
            <Animated.View entering={entering} exiting={exiting}>
              <IconButton
                icon="arrow-back"
                size={iconSize}
                onPress={goBack}
                style={styles.backButton}
                variant="transparent"
                vibrate
              />
            </Animated.View>
          )}
          {showLogo && (
            <Animated.View entering={entering} exiting={exiting}>
              <TouchableOpacity
                onPress={() => navigate({ name: "decks" })}
                style={imageContainerStyle}
                contentContainerStyle={imageContainerStyle}
                vibrate
              >
                <Image
                  style={styles.image}
                  contentFit="contain"
                  source={source}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
          <View style={styles.trimmedContent}>
            {title && (
              <Animated.View entering={entering} exiting={exiting}>
                <ThemedText type="h3" style={styles.title} numberOfLines={1}>
                  {title}
                </ThemedText>
              </Animated.View>
            )}
          </View>
          <View style={styles.rightContainer}>
            {name === "play" && deckId && <TabletopToolbar deckId={deckId} />}
            {open && (
              <>
                {isLoggedIn ? (
                  <Animated.View
                    entering={entering}
                    exiting={exiting}
                    style={styles.settings}
                  >
                    <ProfilePic
                      key="toolbar-profile-pic"
                      fallbackIcon="settings"
                      loadingBehaviour="fallback-icon"
                      size={iconSize}
                      onPress={open}
                    />
                  </Animated.View>
                ) : (
                  <Animated.View
                    entering={entering}
                    exiting={exiting}
                    style={styles.settings}
                  >
                    <IconButton
                      icon="settings"
                      size={iconSize}
                      onPress={open}
                      variant="transparent"
                    />
                  </Animated.View>
                )}
              </>
            )}
          </View>
        </View>
      </ContentWidth>
      {shouldAnimateLoading && <Animated.View style={loadingProgressStyle} />}
    </View>
  );
});
