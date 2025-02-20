import React from "react";
import CardAction from "./CardAction";
import {
  undo,
  selectTabletopHasPast,
  selectTabletopHasFuture,
  redo,
} from "@/store/slices/tabletop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet, View } from "react-native";

export interface TabletopToolbarProps {
  tabletopId: string;
}

export default function TabletopToolbar(
  props: TabletopToolbarProps
): React.ReactNode {
  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, props)
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, props)
  );

  return (
    <View style={styles.container}>
      <CardAction
        icon="Un"
        onPress={hasPast ? () => dispatch(undo(props)) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasPast ? 1 : 0.5 },
        ])}
      />
      <CardAction
        icon="Re"
        onPress={hasFuture ? () => dispatch(redo(props)) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasFuture ? 1 : 0.5 },
        ])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "grey",
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
  },
  action: {},
});
