import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { fixed } from "@/constants/colors";

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
  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.card,
        {
          height,
          width,
          borderRadius,
          backgroundColor: backgroundColor ?? "transparent",
          boxShadow: shadow
            ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${fixed.shadow}`
            : undefined,
        },
        styleProp,
      ]),
    [styleProp, backgroundColor, borderRadius, height, width, shadow],
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
