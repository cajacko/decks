import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import Link from "@/components/ui/Link";
import { iosAppStoreLink, playStoreLink } from "@/constants/links";

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
        href={iosAppStoreLink}
        target="_blank"
        style={styles.link}
        TouchableProps={{ style: styles.pressable }}
      >
        <Image
          style={[styles.appStore, { height }]}
          source={require("../../assets/images/app-store.svg")}
          contentFit="contain"
        />
      </Link>
      <Link
        href={playStoreLink}
        target="_blank"
        style={styles.link}
        TouchableProps={{ style: styles.pressable }}
      >
        <Image
          style={[styles.playStore, { height }]}
          source={require("../../assets/images/play-store.svg")}
          contentFit="contain"
        />
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
