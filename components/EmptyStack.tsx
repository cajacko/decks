import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Card, { CardProps, getBorderRadius } from "./Card";
import { useTabletopContext } from "./Tabletop/Tabletop.context";
import { useAppDispatch } from "@/store/hooks";
import { deleteStack } from "@/store/slices/tabletop";

export type EmptyStackProps = {
  stackId: string;
  style?: CardProps["style"];
  CardProps?: CardProps;
  handleDeleteStack?: () => void;
};

export default function EmptyStack({
  stackId,
  style,
  CardProps,
  handleDeleteStack: handleDeleteStackProp,
}: EmptyStackProps): React.ReactNode {
  const context = useTabletopContext();
  const dispatch = useAppDispatch();

  const handleDeleteStack = React.useCallback(async () => {
    dispatch(deleteStack({ tabletopId: context.tabletopId, stackId: stackId }));
  }, [dispatch, stackId, context.tabletopId]);

  return (
    <Card
      innerStyle={styles.inner}
      {...CardProps}
      style={StyleSheet.flatten([styles.container, style, CardProps?.style])}
    >
      <View
        style={StyleSheet.flatten([
          styles.content,
          { borderRadius: getBorderRadius(context) },
        ])}
      >
        <Text style={styles.text}>Empty Stack</Text>
        <View style={styles.delete}>
          <Button
            title="Delete stack"
            onPress={handleDeleteStackProp ?? handleDeleteStack}
          />
        </View>
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
    backgroundColor: "#ffffff2b",
    verticalAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
