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

export function getContentWidth(
  props: Pick<ContentWidthProps, "padding"> & {
    availableWidth: number;
  },
) {
  const fullWidth = Math.min(props.availableWidth, contentMaxWidth);
  const padding =
    props.padding === "standard"
      ? styles.standardPadding.paddingHorizontal * 2
      : 0;

  return fullWidth - padding;
}

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
        styles.content,
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
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    position: "relative",
    zIndex: 2,
  },
});
