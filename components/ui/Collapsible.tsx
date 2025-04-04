import React, { useState, useCallback } from "react";
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
  runOnJS,
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
    children: childrenProp,
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
  const [_isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const isCollapsed = collapsible ? _isCollapsed : false;

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const contentHeight = useSharedValue<number | undefined>(undefined);

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
    const newValue = isCollapsed ? 1 : 0;

    setIsCollapsed(!isCollapsed);

    // Keep height in sync in case performance mode turns off later
    if (performanceMode) {
      heightProgress.value = newValue;

      return;
    }

    setIsAnimating(true);

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

    heightProgress.value = withTiming(newValue, { duration }, (isFinished) => {
      if (isFinished) {
        runOnJS(setIsAnimating)(false);
      }
    });
  }, [isCollapsed, performanceMode, heightProgress, contentHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    let height =
      contentHeight.value === undefined
        ? undefined
        : contentHeight.value * heightProgress.value;

    if (!isAnimating) {
      height = isCollapsed ? 0 : height;
    }

    return {
      height,
      opacity: heightProgress.value,
    };
  });

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  const headerStyleProp = React.useMemo(
    () => StyleSheet.flatten([styles.header, headerStyle]),
    [headerStyle],
  );

  const animatedContentStyle = React.useMemo(
    () => [styles.animatedContent, collapsible && animatedStyle],
    [collapsible, animatedStyle],
  );

  let doNotRenderChildren = performanceMode === true && isCollapsed;
  const children = doNotRenderChildren ? null : childrenProp;
  const hideButRender = isCollapsed && !isAnimating;

  const nonAnimatedContentStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        collapsible && styles.nonAnimatedContent,
        collapsible && hideButRender && styles.outOfViewContent,
      ]),
    [hideButRender, collapsible],
  );

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
            <IconSymbol
              name={isCollapsed ? "expand-more" : "expand-less"}
              size={20}
            />
          )}
        </TouchableOpacity>
      )}
      <Animated.View style={animatedContentStyle}>
        <View style={nonAnimatedContentStyle} onLayout={onContentLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  nonAnimatedContent: {
    position: "absolute",
    width: "100%",
  },
  outOfViewContent: {
    left: -999999,
    pointerEvents: "none",
  },
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
  animatedContent: {
    overflow: "hidden",
    position: "relative",
  },
});
