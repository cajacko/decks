import React from "react";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent, {
  DrawerProps as _DrawerProps,
} from "@/components/Drawer";
import AppError from "@/classes/AppError";
import { useFocusEffect } from "expo-router";

export type DrawerProps = Omit<_DrawerProps, "isOpen" | "closeDrawer">;

interface ContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
  drawerProps: DrawerProps;
  setDrawerProps: (props: DrawerProps) => void;
}

const Context = React.createContext<ContextValue | null>(null);

export function useDrawer() {
  const context = React.useContext(Context);

  if (!context) {
    new AppError("useDrawer must be used within a DrawerProvider").log("error");
  }

  return context;
}

export function useSetDrawerProps(drawerProps?: DrawerProps) {
  const { setDrawerProps } = useDrawer() ?? {};

  useFocusEffect(
    React.useCallback(() => {
      setDrawerProps?.(drawerProps ?? {});
    }, [drawerProps, setDrawerProps]),
  );
}

export function DrawerProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [drawerProps, setDrawerProps] = React.useState<DrawerProps>({});

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = React.useMemo<ContextValue>(
    () => ({
      isOpen,
      setIsOpen,
      open,
      close,
      drawerProps,
      setDrawerProps,
    }),
    [open, close, isOpen, drawerProps],
  );

  const renderDrawerContent = React.useCallback(
    () => (
      <DrawerContent isOpen={isOpen} closeDrawer={close} {...drawerProps} />
    ),
    [drawerProps, isOpen, close],
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
      >
        {props.children}
      </Drawer>
    </Context.Provider>
  );
}
