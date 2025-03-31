import React from "react";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/overlays/Drawer";
import AppError from "@/classes/AppError";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
  children: React.ReactNode;
  setChildren: (children: React.ReactNode) => void;
}

const Context = React.createContext<ContextValue | null>(null);

export function useDrawerChildren(): React.ReactNode {
  const context = React.useContext(Context);

  return context?.children ?? null;
}

export function useDrawer() {
  const context = React.useContext(Context);

  if (!context) {
    new AppError("useDrawer must be used within a DrawerProvider").log("error");
  }

  return context;
}

export function DrawerChildren({ children }: { children: React.ReactNode }) {
  const { setChildren } = useDrawer() ?? {};

  React.useEffect(() => {
    if (!setChildren) {
      new AppError(
        `${DrawerChildren.name} must be used within a DrawerProvider`,
      ).log("warn");

      return;
    }

    setChildren(children);
  }, [setChildren, children]);

  return null;
}

export function DrawerProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const backgroundColor = useThemeColor("background");
  const [children, setChildren] = React.useState<React.ReactNode>(null);

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
      children,
      setChildren,
    }),
    [open, close, isOpen, children],
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
      >
        {props.children}
      </Drawer>
    </Context.Provider>
  );
}
