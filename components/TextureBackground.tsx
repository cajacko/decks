import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

export interface TextureBackgroundProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function TextureBackground({
  style,
  children,
}: TextureBackgroundProps): React.ReactNode {
  return (
    <View style={React.useMemo(() => [styles.container, style], [style])}>
      {children && <View style={styles.content}>{children}</View>}
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
              <Stop offset="70%" stopColor="#5d6683" stopOpacity="1" />
              <Stop offset="100%" stopColor="#3b4258" stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
        <Image
          source={require("@/assets/images/moroccan-flower.png")}
          style={styles.noise}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
}

const offset = "-30%";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    position: "relative",
    flex: 1,
    zIndex: 2,
  },
  background: {
    position: "absolute",
    top: offset,
    left: offset,
    right: offset,
    bottom: offset,
    zIndex: 1,
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
