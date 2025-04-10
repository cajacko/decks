import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useDrawer } from "@/context/Drawer";
import ProfilePic from "@/components/ui/ProfilePic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Href } from "expo-router";
import Image from "@/components/ui/Image";
import { useTextLogo } from "@/hooks/useLogo";
import IconButton from "@/components/forms/IconButton";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFlag from "@/hooks/useFlag";
import { useSkeletonAnimation } from "@/context/Skeleton";
import { useSync } from "@/context/Sync";
import { TouchableOpacity } from "@/components/ui/Pressables";
import { useAuthentication } from "@/context/Authentication";

export interface ToolbarProps {
  title?: string | null;
  logoVisible?: boolean;
  children?: React.ReactNode | null;
  backPath?: Href | null;
  loading?: boolean;
}

export function useToolbarHeight(
  sharedToolbarHeight: SharedValue<number> | null,
) {
  const paddingTop = useSafeAreaInsets().top;
  const height = _contentHeight + paddingTop;

  const animatedHeightStyle = useAnimatedStyle(() => ({
    height: sharedToolbarHeight ? sharedToolbarHeight.value : height,
  }));

  const animatedTopStyle = useAnimatedStyle(() => ({
    top: sharedToolbarHeight ? -(height - sharedToolbarHeight.value) : 0,
  }));

  return {
    animatedTopStyle,
    animatedHeightStyle,
    paddingTop,
    height,
    contentHeight: _contentHeight,
  };
}

export default function Toolbar({
  title,
  logoVisible,
  children,
  backPath,
  sharedToolbarHeight,
  loading: loadingProp = false,
}: Omit<ToolbarProps, "hidden"> & {
  sharedToolbarHeight: SharedValue<number>;
}) {
  const { loading: syncing } = useSync();

  const loading: boolean = loadingProp || syncing;

  const { isLoggedIn } = useAuthentication();
  const { entering, exiting } = useLayoutAnimations();
  const { open } = useDrawer() ?? {};
  const { source, aspectRatio } = useTextLogo();
  const { navigate } = useRouter();
  const { height, paddingTop, animatedTopStyle } =
    useToolbarHeight(sharedToolbarHeight);
  const borderBottomColor = useThemeColor("inputOutline");
  const backgroundColor = useThemeColor("background");
  const primaryColor = useThemeColor("primary");
  const { loopAnimation } = useSkeletonAnimation();
  const shouldAnimateLoading =
    useFlag("TOOLBAR_LOADING_ANIMATION") === "enabled" && loading;

  const back = React.useMemo(() => {
    if (!backPath) return undefined;

    return () => {
      // Adjust for history?
      navigate(backPath);
    };
  }, [backPath, navigate]);

  const containerStyle = React.useMemo(
    () => [
      animatedTopStyle,
      styles.container,
      {
        paddingTop,
        height,
        maxHeight: height,
        borderBottomColor,
        backgroundColor,
      },
    ],
    [animatedTopStyle, height, borderBottomColor, paddingTop, backgroundColor],
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

    if (!shouldAnimateLoading) return {};

    return {
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
    <Animated.View style={containerStyle}>
      <ContentWidth
        padding="standard"
        style={styles.contentWidth}
        contentContainerStyle={styles.contentWidth}
      >
        <View style={styles.content}>
          {back && (
            <Animated.View entering={entering} exiting={exiting}>
              <IconButton
                icon="arrow-back"
                size={iconSize}
                onPress={back}
                style={styles.backButton}
                variant="transparent"
                vibrate
              />
            </Animated.View>
          )}
          {logoVisible && (
            <Animated.View entering={entering} exiting={exiting}>
              <TouchableOpacity
                href="/"
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
            {children}
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
      {shouldAnimateLoading && (
        <Animated.View
          entering={entering}
          exiting={exiting}
          style={loadingProgressStyle}
        />
      )}
    </Animated.View>
  );
}

export const _contentHeight = 50;
const imageHeight = _contentHeight - 10;

export const iconSize = _contentHeight - 20;
export const horizontalPadding = 16;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    position: "absolute",
    right: 0,
    left: 0,
    zIndex: 2,
  },
  contentWidth: {
    height: _contentHeight,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    textOverflow: "ellipsis",
  },
  trimmedContent: {
    flex: 1,
    overflow: "hidden",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  settings: {
    marginLeft: horizontalPadding,
  },
  backButton: {
    marginRight: horizontalPadding,
  },
  action: {
    marginHorizontal: horizontalPadding,
  },
  progress: {
    height: 3,
    position: "absolute",
    bottom: -2,
    zIndex: 500,
    borderRadius: 3,
  },
});
