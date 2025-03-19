import React from "react";
import { Image } from "expo-image";
import { Platform, StyleSheet, View } from "react-native";
import { useTextLogo } from "@/hooks/useLogo";

export default function HeaderLogo(): React.ReactNode {
  const logo = useTextLogo();

  return (
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        contentFit="contain"
        contentPosition="left center"
        source={logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    height: "100%",
    width: 200,
  },
  image: {
    flex: 1,
    width: "100%",
    marginLeft: Platform.OS === "web" ? -30 : 60,
    transform: [{ scale: Platform.OS === "web" ? 0.8 : 1.7 }],
  },
});
