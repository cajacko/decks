import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Link } from "expo-router";

export interface AppStoresProps {
  style?: StyleProp<ViewStyle>;
  height?: number;
}

export default function AppStores({
  style,
  height = 40,
}: AppStoresProps): React.ReactNode {
  return (
    <View style={[styles.container, style]}>
      <Link
        asChild
        href="https://www.playface.fun/s/dex-ios"
        target="_blank"
        style={styles.link}
      >
        <Pressable style={styles.pressable}>
          <Image
            style={[styles.appStore, { height }]}
            source={require("../../assets/images/app-store.svg")}
            contentFit="contain"
          />
        </Pressable>
      </Link>
      <Link
        asChild
        href="https://www.playface.fun/s/dex-playstore"
        target="_blank"
        style={styles.link}
      >
        <Pressable style={styles.pressable}>
          <Image
            style={[styles.playStore, { height }]}
            source={require("../../assets/images/play-store.svg")}
            contentFit="contain"
          />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  link: {
    flex: 1,
  },
  pressable: {
    flex: 1,
  },
  appStore: {},
  playStore: {},
});
