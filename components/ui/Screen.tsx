import React from "react";
import { StyleSheet, View } from "react-native";

export interface ScreenProps {
  children?: React.ReactNode;
  background?: React.ReactNode;
}

export default function Screen(props: ScreenProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{props.children}</View>
      <View style={styles.background}>{props.background}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  content: {
    flex: 1,
    zIndex: 2,
    position: "relative",
  },
  background: {
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
