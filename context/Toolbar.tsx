import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import ThemedView from "@/components/ui/ThemedView";
import ThemedText from "@/components/ui/ThemedText";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useDrawer } from "@/context/Drawer";
import ProfilePic from "@/components/ui/ProfilePic";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "@/utils/uuid";
import {
  useFocusEffect,
  useNavigation,
  useRouter,
  Href,
  Link,
} from "expo-router";
import { Image } from "expo-image";
import { useTextLogo } from "@/hooks/useLogo";
import IconButton from "@/components/forms/IconButton";
import ContentWidth from "@/components/ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ToolbarProps {
  hidden?: boolean;
  title?: string | null;
  logoVisible?: boolean;
  children?: React.ReactNode | null;
  backPath?: Href | null;
}

type ContextState = {
  onPropsChange: (props: {
    id: string;
    props: ToolbarProps;
    isScreenFocussed: boolean;
  }) => void;
  onUnmount: (id: string) => void;
};

const defaultProps: ToolbarProps = {
  hidden: false,
  title: null,
  logoVisible: true,
  children: null,
  backPath: null,
};

const Context = React.createContext<ContextState>({
  onPropsChange: () => undefined,
  onUnmount: () => undefined,
});

function useToolbarHeight() {
  const paddingTop = useSafeAreaInsets().top;

  return {
    paddingTop,
    height: toolbarHeight + paddingTop,
    contentHeight: toolbarHeight,
  };
}

export function Toolbar({
  style: styleProp,
  ...props
}: ToolbarProps & {
  style?: StyleProp<ViewStyle>;
}) {
  const { onPropsChange, onUnmount } = React.useContext(Context);
  const id = React.useMemo(uuid, []);
  const navigation = useNavigation();
  const [isScreenFocussed, setIsScreenFocussed] = React.useState(
    navigation.isFocused,
  );
  const { height } = useToolbarHeight();

  const style = React.useMemo(
    () => StyleSheet.flatten([{ height }, styleProp]),
    [height, styleProp],
  );

  useFocusEffect(
    React.useCallback(() => {
      setIsScreenFocussed(true);

      return () => {
        setIsScreenFocussed(false);
      };
    }, []),
  );

  React.useEffect(() => {
    onPropsChange({
      id,
      props: { ...defaultProps, ...props },
      isScreenFocussed,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPropsChange, isScreenFocussed, id, ...Object.values(props)]);

  React.useEffect(() => () => onUnmount(id), [onUnmount, id]);

  return <View style={style} />;
}

function WholeToolbar({
  title,
  logoVisible,
  children,
  backPath,
}: Omit<ToolbarProps, "hidden">) {
  const { entering, exiting } = useLayoutAnimations();
  const { open } = useDrawer() ?? {};
  const { source, aspectRatio } = useTextLogo();
  const { navigate } = useRouter();
  const { height, paddingTop } = useToolbarHeight();
  const borderBottomColor = useThemeColor("inputOutline");

  const back = React.useMemo(() => {
    if (!backPath) return undefined;

    return () => {
      // Adjust for history?
      navigate(backPath);
    };
  }, [backPath, navigate]);

  const containerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          paddingTop,
          height,
          maxHeight: height,
          borderBottomColor,
        },
      ]),
    [height, borderBottomColor, paddingTop],
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
    <ThemedView style={containerStyle}>
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
    </ThemedView>
  );
}

export function ToolbarProvider(props: { children: React.ReactNode }) {
  const [toolbarProps, setToolbarProps] =
    React.useState<ToolbarProps>(defaultProps);

  const value = React.useMemo(
    (): ContextState => ({
      onPropsChange: ({ id, isScreenFocussed, props: newToolbarProps }) => {
        if (!isScreenFocussed) return;

        setToolbarProps(newToolbarProps);
      },
      onUnmount: (id) => {},
    }),
    [],
  );

  return (
    <Context.Provider value={value}>
      {!toolbarProps.hidden && <WholeToolbar {...toolbarProps} />}
      <View style={styles.children}>{props.children}</View>
    </Context.Provider>
  );
}

export const toolbarHeight = 50;
const imageHeight = toolbarHeight - 10;

export const iconSize = toolbarHeight - 20;
export const horizontalPadding = 16;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2,
  },
  contentWidth: {
    height: toolbarHeight,
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
