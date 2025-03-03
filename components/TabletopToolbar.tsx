import React from "react";
import {
  undo,
  selectTabletopHasPast,
  selectTabletopHasFuture,
  redo,
} from "@/store/slices/tabletop";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import useParentHeaderRight from "@/hooks/useParentHeaderRight";
import text from "@/constants/text";
import IconSymbol from "./IconSymbol";
import ThemedText from "./ThemedText";

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

export const iconSize = 30;

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
    title: text["tabletop.reset.title"],
    message: text["tabletop.reset.message"],
    deleteButtonText: text["tabletop.reset.button"],
  });

  return (
    <View style={styles.container}>
      {component}
      <TouchableOpacity
        onPressOut={props.hasPast ? handleUndo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: props.hasPast ? 1 : 0.5 },
        ])}
      >
        <IconSymbol name="undo" size={iconSize} />
      </TouchableOpacity>
      <TouchableOpacity
        onPressOut={props.hasFuture ? handleRedo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: props.hasFuture ? 1 : 0.5 },
        ])}
      >
        <IconSymbol name="redo" size={iconSize} />
      </TouchableOpacity>
      <TouchableOpacity onPressOut={open} style={styles.action}>
        <ThemedText style={styles.actionText} type="button">
          {text["tabletop.reset.button"]}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

export const horizontalPadding = 16;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    paddingHorizontal: horizontalPadding,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    textAlign: "center",
  },
});
