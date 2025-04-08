import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { styles as contentWidthStyles } from "../ui/ContentWidth";
import { useThemeColor } from "@/hooks/useThemeColor";
import IconButton from "../forms/IconButton";
import ThemedView from "../ui/ThemedView";

export interface ModalSurfaceProps {
  children?: React.ReactNode;
  handleClose?: () => void;
  fullWidth?: boolean;
  fullHeight?: boolean;
  style?: StyleProp<ViewStyle>;
}

const iconButtonSize = 40;

export function ModalSurfaceContent(props: {
  handleClose?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("inputOutline");

  const contentStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.content,
        contentWidthStyles.content,
        {
          backgroundColor,
          borderColor,
        },
        props.style,
      ]),
    [backgroundColor, borderColor, props.style],
  );

  return (
    <ThemedView style={contentStyle}>
      {props.handleClose && (
        <IconButton
          icon="close"
          onPress={props.handleClose}
          style={styles.close}
          size={iconButtonSize}
        />
      )}
      <View>{props.children}</View>
    </ThemedView>
  );
}

export function ModalSurfaceScreen(props: ModalSurfaceProps): React.ReactNode {
  const contentStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        contentWidthStyles.contentContainer,
        props.fullHeight && styles.fullHeight,
        props.fullWidth && styles.fullWidth,
        props.style,
      ]),
    [props.fullHeight, props.fullWidth, props.style],
  );

  return (
    <ModalSurfaceContent style={contentStyle} handleClose={props.handleClose}>
      {props.children}
    </ModalSurfaceContent>
  );
}

const iconOffset = Math.min(
  iconButtonSize / 2,
  contentWidthStyles.standardPadding.paddingHorizontal,
);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: contentWidthStyles.standardPadding.paddingHorizontal,
  },
  fullWidth: {
    width: "100%",
  },
  fullHeight: {
    flex: 1,
  },
  close: {
    position: "absolute",
    top: -iconOffset,
    right: -iconOffset,
    zIndex: 1,
  },
  content: {
    borderWidth: 1,
    borderRadius: 8,
    padding: contentWidthStyles.standardPadding.paddingHorizontal,
  },
});
