import Image from "@/components/ui/Image";
import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { TouchableOpacity } from "@/components/ui/Pressables";
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
      <TouchableOpacity
        href={iosAppStoreLink}
        style={styles.link}
        contentContainerStyle={styles.pressable}
      >
        <Image
          style={[styles.appStore, { height }]}
          source={require("../../assets/images/app-store.svg")}
          contentFit="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        href={playStoreLink}
        style={styles.link}
        contentContainerStyle={styles.pressable}
      >
        <Image
          style={[styles.playStore, { height }]}
          source={require("../../assets/images/play-store.svg")}
          contentFit="contain"
        />
      </TouchableOpacity>
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
