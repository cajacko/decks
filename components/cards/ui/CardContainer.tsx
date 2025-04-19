import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { fixed } from "@/constants/colors";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";
import useFlag from "@/hooks/useFlag";

export interface CardSize {
  height: number;
  width: number;
  borderRadius?: number;
  shadow?: {
    x: number;
    y: number;
    blur: number;
  };
}

export interface CardContainerProps extends CardSize, ViewProps {
  backgroundColor?: string;
}

export default function CardContainer({
  children,
  style: styleProp,
  height,
  width,
  shadow,
  backgroundColor,
  borderRadius = 0,
  ...viewProps
}: CardContainerProps): React.ReactNode {
  usePerformanceMonitor({
    Component: CardContainer.name,
  });

  const useShadows = useFlag("SHADOWS") === "enabled";

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.card,
        {
          height,
          width,
          borderRadius,
          backgroundColor: backgroundColor ?? "transparent",
          boxShadow:
            shadow && useShadows
              ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${fixed.shadow}`
              : undefined,
        },
        styleProp,
      ]),
    [
      styleProp,
      backgroundColor,
      borderRadius,
      height,
      width,
      shadow,
      useShadows,
    ],
  );

  return (
    <View {...viewProps} style={style}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
