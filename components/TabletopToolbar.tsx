import React from "react";
import { StyleSheet } from "react-native";
import IconButton from "./IconButton";
import Toolbar, { iconSize, styles } from "./Toolbar";
import { useSetDrawerProps } from "@/context/Drawer";
import useTabletopHistory from "@/hooks/useTabletopHistory";

export interface TabletopToolbarProps {
  deckId: string;
  tabletopId: string;
}

export default function TabletopToolbar(
  props: TabletopToolbarProps,
): React.ReactNode {
  useSetDrawerProps(props);
  const { undo, redo } = useTabletopHistory(props.tabletopId);

  return (
    <Toolbar useParent>
      <IconButton
        icon="undo"
        size={iconSize}
        variant="transparent"
        onPressOut={undo}
        style={StyleSheet.flatten([styles.action, { opacity: undo ? 1 : 0.5 }])}
        vibrate
      />
      <IconButton
        icon="redo"
        size={iconSize}
        variant="transparent"
        onPressOut={redo}
        style={StyleSheet.flatten([styles.action, { opacity: redo ? 1 : 0.5 }])}
        vibrate
      />
    </Toolbar>
  );
}
