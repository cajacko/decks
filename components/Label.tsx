import React from "react";
import ThemedText, { ThemedTextProps } from "./ThemedText";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface LabelProps
  extends Omit<ThemedTextProps, "style" | "children"> {
  text?: string;
  hasChanges?: boolean;
  style?: ViewStyle;
  textStyle?: ThemedTextProps["style"];
}

export default function Label({
  text,
  hasChanges,
  style,
  textStyle,
  ...themedTextProps
}: LabelProps): React.ReactNode {
  const { entering, exiting } = useLayoutAnimations();
  const changesColor = useThemeColor("changesIndicator");

  const containerStyle = React.useMemo(
    () => StyleSheet.flatten([styles.label, style]),
    [style],
  );

  const changesStyle = React.useMemo(
    () => [styles.changes, { backgroundColor: changesColor }],
    [changesColor],
  );

  return (
    <View style={containerStyle}>
      <View>
        <ThemedText type="h4" {...themedTextProps} style={textStyle}>
          {text}
        </ThemedText>
        {hasChanges && (
          <View style={styles.changesContainer}>
            <Animated.View
              entering={entering}
              exiting={exiting}
              style={changesStyle}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const changesSize = 8;

const styles = StyleSheet.create({
  label: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    justifyContent: "flex-start",
  },
  changesContainer: {
    position: "absolute",
    right: -changesSize * (3 / 2),
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: changesSize,
    height: "100%",
    opacity: 0.25,
  },
  changes: {
    height: changesSize,
    width: changesSize,
    borderRadius: changesSize / 2,
  },
});
