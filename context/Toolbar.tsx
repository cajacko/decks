import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import ThemedText from "@/components/ui/ThemedText";
import Animated, {
  useSharedValue,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useDrawer } from "@/context/Drawer";
import ProfilePic from "@/components/ui/ProfilePic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Href, Link } from "expo-router";
import { Image } from "expo-image";
import { useTextLogo } from "@/hooks/useLogo";
import IconButton from "@/components/forms/IconButton";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import useFlag from "@/hooks/useFlag";
import withScreenControlContext, {
  ContextState as CreateContextState,
} from "@/context/withScreenControlContext";

interface ToolbarProps {
  hidden?: boolean;
  title?: string | null;
  logoVisible?: boolean;
  children?: React.ReactNode | null;
  backPath?: Href | null;
}

type ContextState = CreateContextState<ToolbarProps> & {
  sharedToolbarHeight: SharedValue<number> | null;
};

// We want this for our memo keys later
const defaultProps: { [K in keyof ToolbarProps]: ToolbarProps[K] } = {
  hidden: false,
  title: null,
  logoVisible: true,
  children: null,
  backPath: null,
};

const { Context, useScreenControlContext, useScreenControlProvider } =
  withScreenControlContext<ToolbarProps, ContextState>(
    {
      onPropsChange: () => undefined,
      onUnmount: () => undefined,
      sharedToolbarHeight: null,
      props: defaultProps,
    },
    defaultProps,
    {
      resetOnUnmount: false,
    },
  );

function useToolbarHeight(sharedToolbarHeight: SharedValue<number> | null) {
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

const orderedKeys = Object.keys(defaultProps).sort() as (keyof ToolbarProps)[];

export function Toolbar({
  style: styleProp,
  ...props
}: ToolbarProps & {
  style?: StyleProp<ViewStyle>;
}) {
  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  const { sharedToolbarHeight } = useScreenControlContext(
    React.useMemo(
      () => mergedProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      orderedKeys.map((key) => mergedProps[key]),
    ),
  );

  const { animatedHeightStyle } = useToolbarHeight(sharedToolbarHeight);

  const style = React.useMemo(
    () => [animatedHeightStyle, styleProp],
    [animatedHeightStyle, styleProp],
  );

  return <Animated.View style={style} />;
}

function WholeToolbar({
  title,
  logoVisible,
  children,
  backPath,
  sharedToolbarHeight,
}: Omit<ToolbarProps, "hidden"> & {
  sharedToolbarHeight: SharedValue<number>;
}) {
  const { entering, exiting } = useLayoutAnimations();
  const { open } = useDrawer() ?? {};
  const { source, aspectRatio } = useTextLogo();
  const { navigate } = useRouter();
  const { height, paddingTop, animatedTopStyle } =
    useToolbarHeight(sharedToolbarHeight);
  const borderBottomColor = useThemeColor("inputOutline");
  const backgroundColor = useThemeColor("background");

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
              <Link asChild href="/">
                <Pressable style={imageContainerStyle}>
                  <Image
                    style={styles.image}
                    contentFit="contain"
                    source={source}
                  />
                </Pressable>
              </Link>
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
                  vibrate
                />
              </Animated.View>
            )}
          </View>
        </View>
      </ContentWidth>
    </Animated.View>
  );
}

const animateHeightDuration = 500;

export function ToolbarProvider(props: { children: React.ReactNode }) {
  const { height } = useToolbarHeight(null);
  const sharedToolbarHeight = useSharedValue(height);
  const shouldAnimateHeight = useFlag("TOOLBAR_HEIGHT_ANIMATION") === "enabled";

  const {
    onPropsChange,
    onUnmount,
    props: toolbarProps,
  } = useScreenControlProvider();

  // Happens when insets change e.g. on device rotation etc
  React.useEffect(() => {
    if (shouldAnimateHeight) {
      sharedToolbarHeight.value = withTiming(height, {
        duration: animateHeightDuration,
      });
    } else {
      sharedToolbarHeight.value = height;
    }
  }, [sharedToolbarHeight, height, shouldAnimateHeight]);

  const value = React.useMemo(
    (): ContextState => ({
      props: toolbarProps,
      onPropsChange,
      onUnmount,
      sharedToolbarHeight,
    }),
    [sharedToolbarHeight, onPropsChange, onUnmount, toolbarProps],
  );

  React.useEffect(() => {
    if (shouldAnimateHeight) {
      if (toolbarProps.hidden) {
        sharedToolbarHeight.value = withTiming(0, {
          duration: animateHeightDuration,
        });
      } else {
        sharedToolbarHeight.value = withTiming(height, {
          duration: animateHeightDuration,
        });
      }
    } else {
      sharedToolbarHeight.value = height;
    }
  }, [toolbarProps, height, sharedToolbarHeight, shouldAnimateHeight]);

  return (
    <Context.Provider value={value}>
      <WholeToolbar
        sharedToolbarHeight={sharedToolbarHeight}
        {...toolbarProps}
      />
      <View style={styles.children}>{props.children}</View>
    </Context.Provider>
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
  children: {
    flex: 1,
    position: "relative",
    zIndex: 1,
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
});
