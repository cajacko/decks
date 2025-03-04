import AppError from "@/classes/AppError";
import React from "react";
import { ModalProps, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import useLayoutAnimations from "@/hooks/useLayoutAnimations";
import uuid from "@/utils/uuid";

export type { ModalProps };

type ModalState = {
  id: string;
  props: ModalProps;
};

type ContextState = {
  setModalProps: (id: string, props: ModalProps | null) => void;
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

    context.setModalProps(id, props);

    return () => {
      context.setModalProps(id, null);
    };
  }, [context, props]);

  return null;
}

export function ModalProvider(props: { children: React.ReactNode }) {
  const [modals, setModals] = React.useState<ModalState[]>([]);

  const value = React.useMemo<ContextState>(
    () => ({
      setModalProps: (id, props) => {
        setModals((prev): ModalState[] => {
          // If existing, update, if new add, if null props remove
          const index = prev.findIndex((modal) => modal.id === id);

          if (index === -1 && props) {
            return [...prev, { id, props }];
          }

          if (index !== -1 && !props) {
            return prev.filter((modal) => modal.id !== id);
          }

          if (!props) {
            return prev;
          }

          return prev.map((modal, i): ModalState => {
            if (i === index) {
              return { id, props };
            }

            return modal;
          });
        });
      },
    }),
    [],
  );

  const { entering, exiting } = useLayoutAnimations();

  const modalChildren = React.useMemo(
    () =>
      modals.map(({ id, props }, i) => {
        if (!props.visible) return null;

        return (
          <Animated.View
            key={id}
            entering={entering}
            exiting={exiting}
            style={[styles.modal, { zIndex: 2 + i }]}
          >
            {props.children}
          </Animated.View>
        );
      }),
    [modals, entering, exiting],
  );

  return (
    <Context.Provider value={value}>
      <View style={styles.content}>{props.children}</View>
      {modalChildren}
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
  modal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
