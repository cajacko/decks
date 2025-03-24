import React from "react";
import { Platform, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";
import { useHeaderRight as _useHeaderRight } from "@/hooks/useParentHeaderRight";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import IconButton from "./IconButton";
import { useDrawer } from "@/context/Drawer";
import { TouchableOpacityProps } from "react-native-gesture-handler";

export const iconSize = 30;
export const horizontalPadding = 16;

export interface ToolbarProps {
  children?: React.ReactNode;
  useParent?: boolean;
}

interface HeaderRightProps {
  children?: React.ReactNode;
}

function useHeaderRight({ children, useParent }: ToolbarProps) {
  const headerRight = React.useCallback(
    () => <HeaderRight>{children}</HeaderRight>,
    [children],
  );

  _useHeaderRight({ headerRight, useParent });
}

/**
 * Buttons in the header work a bit strangely on mobile devices and the onPressOut works better.
 * Whereas onPressOut on mobile web does not work for the drawer component. It ends up immediately
 * triggering the close callback
 */
export function useOnPressProps(
  callback?: () => void,
): Pick<TouchableOpacityProps, "onPress" | "onPressOut"> {
  if (Platform.OS === "web") {
    return {
      onPress: callback,
    };
  }

  return {
    onPressOut: callback,
  };
}

// NOTE: This component will only re-render on prop changes, no state changes
function HeaderRight(props: HeaderRightProps): React.ReactNode {
  const { open } = useDrawer() ?? {};
  const { entering, exiting } = useLayoutAnimations();
  const openProps = useOnPressProps(open);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      style={styles.container}
    >
      {props.children}
      {open && (
        <IconButton
          icon="settings"
          size={iconSize}
          variant="transparent"
          style={styles.action}
          {...openProps}
        />
      )}
    </Animated.View>
  );
}

export default function Toolbar({ children, useParent }: ToolbarProps) {
  useHeaderRight({ children, useParent });

  return null;
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  action: {
    paddingHorizontal: horizontalPadding,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
