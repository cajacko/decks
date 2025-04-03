import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSkeletonAnimation } from "@/context/Skeleton";
import { Cards } from "@/store/types";
import { useMmToDp } from "../context/PhysicalMeasures";

export interface CardSkeletonContentProps {
  side: Cards.Side;
  borderRadius?: number;
}

// NOTE: Turning off animation is handled in context as it needs to apply to everything equally and
// prevents the animations from the root
export default function CardSkeletonContent({
  side,
  borderRadius,
}: CardSkeletonContentProps): React.ReactNode {
  const mmToDp = useMmToDp();
  const { color, colorInverse } = useSkeletonAnimation();

  const innerBackgroundColor = useAnimatedStyle(() => {
    return {
      backgroundColor: color.value,
    };
  });

  const textColor = useAnimatedStyle(() => {
    return {
      color: colorInverse.value,
    };
  });

  const containerBackgroundColor = useAnimatedStyle(() => {
    return {
      backgroundColor: colorInverse.value,
    };
  });

  const containerStyle = React.useMemo(
    () => [styles.container, containerBackgroundColor],
    [containerBackgroundColor],
  );

  const innerStyle = React.useMemo(
    () => [styles.inner, { borderRadius }, innerBackgroundColor],
    [borderRadius, innerBackgroundColor],
  );

  const textStyle = React.useMemo(
    () => [
      styles.text,
      {
        fontSize: mmToDp(60),
        marginTop: mmToDp(7),
      },
      textColor,
    ],
    [textColor, mmToDp],
  );

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={innerStyle}>
        {side === "back" && <Animated.Text style={textStyle}>D</Animated.Text>}
      </Animated.View>
    </Animated.View>
  );
}

const borderSize = 1;

const styles = StyleSheet.create({
  text: {
    fontFamily: "LuckiestGuy",
    opacity: 0.1,
  },
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inner: {
    position: "absolute",
    top: borderSize,
    left: borderSize,
    right: borderSize,
    bottom: borderSize,
    overflow: "hidden",
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
