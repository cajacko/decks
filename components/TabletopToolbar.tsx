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
import { useTabletopContext } from "./Tabletop/Tabletop.context";

export default function TabletopToolbar(): React.ReactNode {
  const { tabletopId } = useTabletopContext();
  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, { tabletopId })
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, { tabletopId })
  );

  return (
    <View style={styles.container}>
      <CardAction
        icon="Un"
        onPress={hasPast ? () => dispatch(undo({ tabletopId })) : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasPast ? 1 : 0.5 },
        ])}
      />
      <CardAction
        icon="Re"
        onPress={hasFuture ? () => dispatch(redo({ tabletopId })) : undefined}
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
