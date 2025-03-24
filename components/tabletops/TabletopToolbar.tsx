import React from "react";
import { StyleSheet } from "react-native";
import IconButton from "@/components/forms/IconButton";
import Toolbar, {
  iconSize,
  styles,
  useOnPressProps,
} from "@/components/ui/Toolbar";
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
  const undoProps = useOnPressProps(undo);
  const redoProps = useOnPressProps(redo);

  return (
    <Toolbar useParent>
      <IconButton
        icon="undo"
        size={iconSize}
        variant="transparent"
        style={StyleSheet.flatten([styles.action, { opacity: undo ? 1 : 0.5 }])}
        vibrate
        {...undoProps}
      />
      <IconButton
        icon="redo"
        size={iconSize}
        variant="transparent"
        style={StyleSheet.flatten([styles.action, { opacity: redo ? 1 : 0.5 }])}
        vibrate
        {...redoProps}
      />
    </Toolbar>
  );
}
