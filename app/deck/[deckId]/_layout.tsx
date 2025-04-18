import React from "react";
import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function DeckLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    zIndex: 2,
  },
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
});
