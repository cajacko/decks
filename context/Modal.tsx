import AppError from "@/classes/AppError";
import React from "react";
import { ModalProps, StyleSheet, View } from "react-native";
import uuid from "@/utils/uuid";

export type { ModalProps };

type ModalState = {
  id: string;
  props: ModalProps;
};

type ContextState = {
  getActiveModalId: () => string | null;
  setModalState: React.Dispatch<React.SetStateAction<ModalState | null>>;
};

const Context = React.createContext<ContextState | undefined>(undefined);

export function Modal(props: ModalProps) {
  const context = React.useContext(Context);

  React.useEffect(() => {
    if (!context) {
      new AppError(
        "Modal component rendered outside of ModalProvider, we couldn't show it",
      ).log("error");

      return;
    }

    if (!props.visible) return;

    const id = uuid();

    context.setModalState({ id, props });

    return () => {
      if (id !== context.getActiveModalId()) return;

      context.setModalState(null);
    };
  }, [context, props]);

  return null;
}

export function ModalProvider(props: { children: React.ReactNode }) {
  const [modalState, setModalState] = React.useState<ModalState | null>(null);

  const modalStateRef = React.useRef(modalState);
  modalStateRef.current = modalState;

  const value = React.useMemo<ContextState>(
    () => ({
      setModalState,
      getActiveModalId: () => modalStateRef.current?.id ?? null,
    }),
    [],
  );

  return (
    <Context.Provider value={value}>
      {props.children}
      {modalState?.props.visible && (
        <View style={styles.container}>{modalState.props.children}</View>
      )}
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
