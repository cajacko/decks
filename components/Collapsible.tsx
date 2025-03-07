import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import IconSymbol from "./IconSymbol";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export interface CollapsibleProps {
  title?: string | null;
  children?: React.ReactNode;
  style?: ViewStyle;
  collapsible?: boolean;
  initialCollapsed?: boolean;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  titleProps?: Partial<ThemedTextProps>;
}

export default function Collapsible({
  title,
  children,
  style: styleProp,
  collapsible = true,
  initialCollapsed = true,
  collapsed: controlledCollapsed,
  onCollapse,
  titleProps,
}: CollapsibleProps): React.ReactNode {
  const isControlled = controlledCollapsed !== undefined;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  // Manage internal state when uncontrolled
  const toggleCollapse = useCallback(() => {
    if (collapsible) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      onCollapse?.(newState);
    }
  }, [isCollapsed, collapsible, onCollapse]);

  useEffect(() => {
    if (isControlled) {
      setIsCollapsed(controlledCollapsed);
    }
  }, [controlledCollapsed, isControlled]);

  const height = useSharedValue(isCollapsed ? 0 : 1);

  useEffect(() => {
    height.value = withTiming(isCollapsed ? 0 : 1, { duration: 300 });
  }, [isCollapsed, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value === 0 ? 0 : "auto",
    opacity: height.value,
  }));

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  return (
    <View style={style}>
      {title && (
        <TouchableOpacity
          onPress={toggleCollapse}
          disabled={!collapsible}
          style={styles.header}
        >
          <ThemedText type="body1" {...titleProps} style={titleProps?.style}>
            {title}
          </ThemedText>
          {collapsible && (
            <IconSymbol
              name={isCollapsed ? "expand-more" : "expand-less"}
              size={20}
            />
          )}
        </TouchableOpacity>
      )}
      <Animated.View style={[styles.content, collapsible && animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    overflow: "hidden",
  },
});
