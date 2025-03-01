import React from "react";
import {
  undo,
  selectTabletopHasPast,
  selectTabletopHasFuture,
  redo,
} from "@/store/slices/tabletop";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";

interface TabletopToolbarProps {
  tabletopId: string;
  hasPast: boolean;
  hasFuture: boolean;
}

export function useTabletopToolbar({
  tabletopId,
}: {
  tabletopId: string;
}): TabletopToolbarProps {
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, { tabletopId }),
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, { tabletopId }),
  );

  const headerRight = React.useCallback(
    () => (
      <TabletopToolbar
        tabletopId={tabletopId}
        hasFuture={hasFuture}
        hasPast={hasPast}
      />
    ),
    [tabletopId, hasFuture, hasPast],
  );

  useParentHeaderRight(headerRight, "tabletop");

  return {
    tabletopId,
    hasPast,
    hasFuture,
  };
}

export default function TabletopToolbar(
  props: TabletopToolbarProps,
): React.ReactNode {
  // NOTE: This component will only re-render on prop changes, no state changes
  const dispatch = useAppDispatch();

  const handleUndo = React.useCallback(() => {
    dispatch(undo({ tabletopId: props.tabletopId }));
  }, [dispatch, props.tabletopId]);

  const handleRedo = React.useCallback(() => {
    dispatch(redo({ tabletopId: props.tabletopId }));
  }, [dispatch, props.tabletopId]);

  const { component, open } = useDeleteWarning({
    handleDelete: () => {
      dispatch(resetTabletopHelper({ tabletopId: props.tabletopId }));
    },
    title: "Reset Play Area",
    message:
      "This will move all cards back into the first stack and deck order",
    deleteButtonText: "Reset",
  });

  return (
    <View style={styles.container}>
      {component}
      <TouchableHighlight
        onPressOut={props.hasPast ? handleUndo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: props.hasPast ? 1 : 0.5 },
        ])}
      >
        <Text style={styles.actionText}>Undo</Text>
      </TouchableHighlight>
      <TouchableHighlight
        onPressOut={props.hasFuture ? handleRedo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: props.hasFuture ? 1 : 0.5 },
        ])}
      >
        <Text style={styles.actionText}>Redo</Text>
      </TouchableHighlight>
      <TouchableHighlight onPressOut={open} style={styles.action}>
        <Text style={styles.actionText}>Reset</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    marginLeft: 10,
    backgroundColor: "blue",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionText: {
    color: "white",
    textAlign: "center",
  },
});
