import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
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
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
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
    collapsed: controlledCollapsed,
    onCollapse,
    titleProps,
    subTitleProps,
    subTitle,
    headerStyle,
    leftAdornment,
  } = props;

  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";
  const [isCollapsed, setIsCollapsed] = useState(
    controlledCollapsed === undefined ? initialCollapsed : controlledCollapsed,
  );

  const leftAdornmentSize = useLeftAdornmentSize(props);

  // Manage internal state when uncontrolled
  const toggleCollapse = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse?.(newState);
  }, [isCollapsed, onCollapse]);

  useEffect(() => {
    if (controlledCollapsed === undefined) return;

    setIsCollapsed(controlledCollapsed);
  }, [controlledCollapsed]);

  const height = useSharedValue(isCollapsed ? 0 : 1);

  useEffect(() => {
    const newValue = isCollapsed ? 0 : 1;

    if (performanceMode) {
      height.value = newValue;
    } else {
      height.value = withTiming(newValue, { duration: 300 });
    }
  }, [isCollapsed, height, performanceMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value === 0 ? 0 : "auto",
    opacity: height.value,
  }));

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  const headerStyleProp = React.useMemo(
    () => StyleSheet.flatten([styles.header, headerStyle]),
    [headerStyle],
  );

  const contentStyle = React.useMemo(
    () => [styles.content, collapsible && animatedStyle],
    [collapsible, animatedStyle],
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
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  content: {
    overflow: "hidden",
  },
});
