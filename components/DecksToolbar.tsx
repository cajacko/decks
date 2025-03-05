import React from "react";
import { StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
import { useHeaderRight } from "@/hooks/useParentHeaderRight";
import { iconSize, horizontalPadding } from "./TabletopToolbar";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import IconButton from "./IconButton";
import { useDrawer } from "@/context/Drawer";

interface DecksToolbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function useDecksToolbarProps() {
  const [open, setOpen] = React.useState(false);

  const headerRight = React.useCallback(
    () => <DecksToolbar open={open} setOpen={setOpen} />,
    [open, setOpen],
  );

  useHeaderRight({ headerRight });

  return {};
}

export default function DecksToolbar(
  props: DecksToolbarProps,
): React.ReactNode {
  const { open } = useDrawer() ?? {};
  // NOTE: This component will only re-render on prop changes, no state changes
  // const { navigate } = useRouter();
  const { entering, exiting } = useLayoutAnimations();

  if (!open) return;

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={styles.container}
    >
      <IconButton
        icon="settings"
        size={iconSize}
        variant="transparent"
        onPressOut={open}
        style={styles.action}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    paddingHorizontal: horizontalPadding,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    // Hidden until we have non dev mode stuff to show
    opacity: 0,
  },
});
