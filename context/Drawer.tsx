import React from "react";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/overlays/Drawer";
import AppError from "@/classes/AppError";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import withScreenControlContext, {
  ContextState as CreateContextState,
} from "@/context/withScreenControlContext";

type Props = React.ReactNode;

type ContextState = CreateContextState<Props> & {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
};

const { Context, useScreenControlContext, useScreenControlProvider } =
  withScreenControlContext<Props, ContextState>(
    {
      close: () => undefined,
      open: () => undefined,
      isOpen: false,
      setIsOpen: () => undefined,
      onPropsChange: () => undefined,
      onUnmount: () => undefined,
      props: null,
    },
    null,
    {
      resetOnUnmount: true,
    },
  );

export function useDrawerChildren(): React.ReactNode {
  const context = React.useContext(Context);

  return context?.props ?? null;
}

export function useDrawer() {
  const context = React.useContext(Context);

  if (!context) {
    new AppError("useDrawer must be used within a DrawerProvider").log("error");
  }

  return context;
}

export function DrawerChildren({ children }: { children: React.ReactNode }) {
  useScreenControlContext(children);

  return null;
}

export function DrawerProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const backgroundColor = useThemeColor("background");

  const {
    onPropsChange,
    onUnmount,
    props: children,
  } = useScreenControlProvider();

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = React.useMemo<ContextState>(
    () => ({
      isOpen,
      setIsOpen,
      open,
      close,
      onPropsChange,
      props: children,
      onUnmount,
    }),
    [open, close, isOpen, children, onUnmount, onPropsChange],
  );

  const renderDrawerContent = React.useCallback(
    () => <DrawerContent closeDrawer={close}>{children}</DrawerContent>,
    [children, close],
  );

  const drawerStyle = React.useMemo(
    () => ({
      backgroundColor,
    }),
    [backgroundColor],
  );

  return (
    <Context.Provider value={value}>
      <Drawer
        onOpen={open}
        open={isOpen}
        onClose={close}
        renderDrawerContent={renderDrawerContent}
        drawerPosition="right"
        drawerType="front"
        swipeEnabled={false}
        drawerStyle={drawerStyle}
        style={styles.container}
      >
        {props.children}
      </Drawer>
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flex: 1,
  },
});
