import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

export interface ContentWidthProps extends ViewProps {
  padding?: "standard" | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const contentMaxWidth = 800;

export default function ContentWidth({
  style: styleProp,
  contentContainerStyle: contentContainerStyleProp,
  padding = null,
  children,
  ...props
}: ContentWidthProps): React.ReactNode {
  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, styleProp]),
    [styleProp],
  );

  const contentContainerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.contentContainer,
        padding === "standard" && styles.standardPadding,
        contentContainerStyleProp,
      ]),
    [contentContainerStyleProp, padding],
  );

  return (
    <View {...props} style={style}>
      <View style={contentContainerStyle}>{children}</View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  contentContainer: {
    maxWidth: contentMaxWidth,
    width: "100%",
  },
  standardPadding: {
    paddingHorizontal: 20,
  },
});
