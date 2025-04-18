import React from "react";
import { Drawer } from "react-native-drawer-layout";
import DrawerContent from "@/components/overlays/Drawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { BackHandler, StyleSheet } from "react-native";

type ContextState = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  open: () => void;
  close: () => void;
};

const Context = React.createContext<ContextState>({
  isOpen: false,
  setIsOpen: () => {},
  open: () => {},
  close: () => {},
});

export function useDrawer() {
  const context = React.useContext(Context);

  return context;
}

export function DrawerProvider(props: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const backgroundColor = useThemeColor("background");

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
    }),
    [open, close, isOpen],
  );

  const renderDrawerContent = React.useCallback(
    () => <DrawerContent closeDrawer={close} />,
    [close],
  );

  const drawerStyle = React.useMemo(
    () => ({
      backgroundColor,
    }),
    [backgroundColor],
  );

  React.useEffect(() => {
    if (!isOpen) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        close();

        return true;
      },
    );

    return subscription.remove;
  }, [isOpen, close]);

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
