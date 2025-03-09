import React from "react";
import {
  undo,
  selectTabletopHasPast,
  selectTabletopHasFuture,
  redo,
} from "@/store/slices/tabletop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StyleSheet } from "react-native";
import IconButton from "./IconButton";
import Toolbar, { iconSize, styles } from "./Toolbar";
import { useSetDrawerProps } from "@/context/Drawer";

export interface TabletopToolbarProps {
  deckId: string;
  tabletopId: string;
}

export default function TabletopToolbar(
  props: TabletopToolbarProps,
): React.ReactNode {
  useSetDrawerProps(props);

  const dispatch = useAppDispatch();
  const hasPast = useAppSelector((state) =>
    selectTabletopHasPast(state, props),
  );
  const hasFuture = useAppSelector((state) =>
    selectTabletopHasFuture(state, props),
  );

  const handleUndo = React.useCallback(() => {
    dispatch(undo({ tabletopId: props.tabletopId }));
  }, [dispatch, props.tabletopId]);

  const handleRedo = React.useCallback(() => {
    dispatch(redo({ tabletopId: props.tabletopId }));
  }, [dispatch, props.tabletopId]);

  return (
    <Toolbar useParent>
      <IconButton
        icon="undo"
        size={iconSize}
        variant="transparent"
        onPressOut={hasPast ? handleUndo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasPast ? 1 : 0.5 },
        ])}
      />
      <IconButton
        icon="redo"
        size={iconSize}
        variant="transparent"
        onPressOut={hasFuture ? handleRedo : undefined}
        style={StyleSheet.flatten([
          styles.action,
          { opacity: hasFuture ? 1 : 0.5 },
        ])}
      />
    </Toolbar>
  );
}
