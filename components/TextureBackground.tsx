import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { fixed } from "@/constants/colors";
import uuid from "@/utils/uuid";

export interface TextureBackgroundProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function TextureBackground({
  style,
  children,
}: TextureBackgroundProps): React.ReactNode {
  const id = React.useRef(uuid()).current;

  return (
    <View style={React.useMemo(() => [styles.container, style], [style])}>
      {children && <View style={styles.content}>{children}</View>}
      <View style={styles.background}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient
              id={id}
              cx="50%"
              cy="50%"
              rx="50%"
              ry="50%"
              fx="50%"
              fy="50%"
            >
              <Stop
                offset="0%"
                stopColor={fixed.textureBackground.stop1}
                stopOpacity="1"
              />
              <Stop
                offset="70%"
                stopColor={fixed.textureBackground.stop2}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={fixed.textureBackground.stop3}
                stopOpacity="1"
              />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
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
});
