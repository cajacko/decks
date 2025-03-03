import React from "react";
import { View, StyleSheet } from "react-native";
import Card, { CardProps, getBorderRadius } from "./Card";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import text from "@/constants/text";
import Button from "./Button";
import { fixed } from "@/constants/colors";
import { defaultOpacity } from "./CardAction";

export type EmptyStackProps = {
  style?: CardProps["style"];
  CardProps?: CardProps;
  handleDeleteStack?: () => void;
};

export default function EmptyStack({
  style,
  CardProps,
  handleDeleteStack,
}: EmptyStackProps): React.ReactNode {
  const context = useTabletopContext();

  return (
    <Card
      innerStyle={styles.inner}
      {...CardProps}
      style={StyleSheet.flatten([styles.container, style, CardProps?.style])}
    >
      <View
        style={StyleSheet.flatten([
          styles.content,
          { borderRadius: getBorderRadius(context.cardSizes) },
        ])}
      >
        {handleDeleteStack && (
          <Button
            style={styles.delete}
            title={text["stack.actions.delete"]}
            onPress={handleDeleteStack}
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
  delete: {
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
    borderColor: fixed.emptyStackBorder,
    borderStyle: "dashed",
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
});
