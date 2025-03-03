import React from "react";
import { View, StyleSheet, Button } from "react-native";
import Card, { CardProps, getBorderRadius } from "./Card";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import text from "@/config/text";

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
          <View style={styles.delete}>
            <Button
              title={text["stack.actions.delete"]}
              onPress={handleDeleteStack}
            />
          </View>
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
  },
  // Slightly smaller so it doesn't poke out of the cards when in a stack
  content: {
    position: "absolute",
    top: "2%",
    left: "2%",
    right: "2%",
    bottom: "2%",
    borderWidth: 2,
    borderColor: "#f0f0f0",
    borderStyle: "dashed",
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
});
