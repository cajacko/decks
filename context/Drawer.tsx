import React from "react";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/Drawer";
import AppError from "@/classes/AppError";

const Context = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
} | null>(null);

export function useDrawer() {
  const context = React.useContext(Context);

  if (!context) {
    new AppError("useDrawer must be used within a DrawerProvider").log("error");
  }

  return context;
}

export function DrawerProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      setIsOpen,
      open,
      close,
    }),
    [open, close, isOpen],
  );

  return (
    <Context.Provider value={value}>
      <Drawer
        onOpen={open}
        open={isOpen}
        onClose={close}
        // Having a function allows hot reloading to work
        renderDrawerContent={
          process.env.NODE_ENV === "development"
            ? () => <DrawerContent />
            : DrawerContent
        }
        drawerPosition="right"
        drawerType="slide"
        swipeEnabled={false}
      >
        {props.children}
      </Drawer>
    </Context.Provider>
  );
}
