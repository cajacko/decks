import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export interface TextureBackgroundProps {
  style?: ViewStyle;
}

export default function TextureBackground({
  style,
}: TextureBackgroundProps): React.ReactNode {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.background}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id="grad"
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop offset="0%" stopColor="#b0bfdb" stopOpacity="1" />
              {/* <Stop offset="90%" stopColor="#f6c7a5" stopOpacity="1" /> */}
              <Stop offset="100%" stopColor="#3b4258" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        <Image
          source={require("@/assets/images/moroccan-flower.png")}
          style={styles.noise}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  background: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    right: "-50%",
    bottom: "-50%",
  },
  noise: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2, // Adjust the opacity to control the visibility of the noise
    height: "100%",
    width: "100%",
  },
});
