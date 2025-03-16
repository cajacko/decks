import React from "react";
import { View, StyleSheet } from "react-native";
import Card, { CardProps, getBorderRadius } from "./Card";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import Button from "./Button";
import { fixed } from "@/constants/colors";
import { defaultOpacity } from "./CardAction";
import { useThemeColor } from "@/hooks/useThemeColor";

export type EmptyStackProps = {
  style?: CardProps["style"];
  CardProps?: CardProps;
  buttonTitle?: string;
  buttonAction?: () => void;
};

export default function EmptyStack({
  style,
  CardProps,
  buttonAction,
  buttonTitle,
}: EmptyStackProps): React.ReactNode {
  const context = useTabletopContext();
  const borderColor = useThemeColor("emptyStackBorder");

  return (
    <Card
      innerStyle={styles.inner}
      {...CardProps}
      style={StyleSheet.flatten([styles.container, style, CardProps?.style])}
    >
      <View
        style={StyleSheet.flatten([
          styles.content,
          { borderRadius: getBorderRadius(context.cardSizes), borderColor },
        ])}
      >
        {buttonAction && buttonTitle && (
          <Button
            style={styles.action}
            title={buttonTitle}
            onPress={buttonAction}
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  inner: {
    borderWidth: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  action: {
    marginTop: 20,
    opacity: defaultOpacity,
  },
  // Slightly smaller so it doesn't poke out of the cards when in a stack
  content: {
    position: "absolute",
    top: "2%",
    left: "2%",
    right: "2%",
    bottom: "2%",
    borderWidth: 2,
    borderStyle: "dashed",
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
});
