import React, { useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ViewProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import IconSymbol from "./IconSymbol";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import Label, { LabelProps } from "../forms/Label";
import useFlag from "@/hooks/useFlag";

export interface CollapsibleProps {
  title?: string | null;
  subTitle?: string | null;
  children?: React.ReactNode;
  style?: ViewStyle;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  titleProps?: Partial<LabelProps>;
  subTitleProps?: Partial<ThemedTextProps>;
  headerStyle?: ViewStyle;
  leftAdornment?: React.ReactNode;
}

export function useLeftAdornmentSize(
  props: Pick<CollapsibleProps, "titleProps">,
): number {
  return 25;
}

export default function Collapsible(props: CollapsibleProps): React.ReactNode {
  const {
    title,
    children,
    style: styleProp,
    collapsible = true,
    initialCollapsed = true,
    titleProps,
    subTitleProps,
    subTitle,
    headerStyle,
    leftAdornment,
  } = props;
  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";
  const isAnimating = useSharedValue<boolean>(false);
  const contentHeight = useSharedValue<number | undefined>(undefined);
  const isCollapsed = useSharedValue<boolean>(
    collapsible ? initialCollapsed : false,
  );

  const onContentLayout = React.useCallback<NonNullable<ViewProps["onLayout"]>>(
    (event) => {
      contentHeight.value = event.nativeEvent.layout.height;
    },
    [contentHeight],
  );

  const leftAdornmentSize = useLeftAdornmentSize(props);
  const heightProgress = useSharedValue(isCollapsed ? 0 : 1);

  // Manage internal state when uncontrolled
  const toggleCollapse = useCallback(() => {
    const newValue = isCollapsed.value ? 1 : 0;
    isCollapsed.value = !isCollapsed.value;

    // Keep height in sync in case performance mode turns off later
    if (performanceMode) {
      heightProgress.value = newValue;

      return;
    }

    isAnimating.value = true;

    let duration: number;

    if (contentHeight.value === undefined) {
      // Default
      duration = 500;
    } else {
      // Calculate duration based off our desired velocity rather than a certain time as it looks
      // strange when the content is very small
      const velocity = 0.5; // pixels per millisecond

      const targetHeight = contentHeight.value * newValue;
      const currentHeight = contentHeight.value * heightProgress.value;
      const distance = Math.abs(targetHeight - currentHeight);
      duration = distance / velocity;
    }

    duration = Math.min(duration, 500); // Cap the max duration

    heightProgress.value = withTiming(newValue, { duration }, (finished) => {
      if (finished) {
        isAnimating.value = false;
      }
    });
  }, [
    isCollapsed,
    performanceMode,
    heightProgress,
    contentHeight,
    isAnimating,
  ]);

  const contentContainerAnimatedStyle = useAnimatedStyle(() => {
    if (!collapsible) {
      return {
        height: "auto",
        opacity: 1,
      };
    }

    let height: "auto" | number =
      contentHeight.value === undefined
        ? "auto"
        : contentHeight.value * heightProgress.value;

    if (isAnimating.value) {
      height =
        contentHeight.value === undefined
          ? "auto"
          : contentHeight.value * heightProgress.value;
    } else {
      height = isCollapsed.value ? 0 : "auto";
    }

    return {
      height,
      opacity: heightProgress.value,
    };
  }, [collapsible, isAnimating, heightProgress, isCollapsed]);

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  const headerStyleProp = React.useMemo(
    () => StyleSheet.flatten([styles.header, headerStyle]),
    [headerStyle],
  );

  const contentContainerStyle = React.useMemo(
    () => [styles.contentContainer, contentContainerAnimatedStyle],
    [contentContainerAnimatedStyle],
  );

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${isCollapsed.value ? "-" : ""}${heightProgress.value * 180}deg`,
        },
      ],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const hide = isCollapsed.value && !isAnimating.value;

    return {
      position: hide ? "absolute" : "relative",
      left: hide ? -999999 : 0,
    };
  });

  return (
    <View style={style}>
      {(title || subTitle) && (
        <TouchableOpacity
          onPress={toggleCollapse}
          disabled={!collapsible}
          style={headerStyleProp}
        >
          <View style={styles.headerElements}>
            {leftAdornment && (
              <View
                style={[styles.leftAdornment, { width: leftAdornmentSize }]}
              >
                {leftAdornment}
              </View>
            )}
            <View style={styles.headerText}>
              {title && (
                <Label
                  text={title}
                  type="body1"
                  truncate
                  {...titleProps}
                  style={titleProps?.style}
                />
              )}
              {subTitle && (
                <ThemedText
                  type="body2"
                  truncate
                  {...subTitleProps}
                  style={subTitleProps?.style}
                >
                  {subTitle}
                </ThemedText>
              )}
            </View>
          </View>
          {collapsible && (
            <Animated.View style={iconAnimatedStyle}>
              <IconSymbol name="expand-more" size={20} />
            </Animated.View>
          )}
        </TouchableOpacity>
      )}
      <Animated.View style={contentContainerStyle}>
        <Animated.View style={contentAnimatedStyle}>
          <View onLayout={onContentLayout}>{children}</View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  // content: {
  //   position: "relative",
  //   width: "100%",
  // },
  // animatingContent: {
  //   position: "absolute",
  // },
  // outOfViewContent: {
  //   position: "absolute",
  //   left: -999999,
  //   pointerEvents: "none",
  // },
  container: {
    overflow: "hidden",
  },
  leftAdornment: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerElements: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
  },
  contentContainer: {
    overflow: "hidden",
    position: "relative",
  },
});
