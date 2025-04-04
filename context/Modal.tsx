import AppError from "@/classes/AppError";
import React from "react";
import {
  ModalProps,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
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

export function useModal(props: ModalProps) {
  const context = React.useContext(Context);
  const idRef = React.useRef(uuid());

  const clearModal = () => {
    context?.setModalProps(idRef.current, null);
  };

  const clearRef = React.useRef(clearModal);
  clearRef.current = clearModal;

  // Update the modal props when they change
  React.useEffect(() => {
    if (!context) {
      new AppError(
        "Modal component rendered outside of ModalProvider, we couldn't show it",
      ).log("error");

      return;
    }

    context.setModalProps(idRef.current, props);
  }, [context, props]);

  // Clear up safely on unmount
  React.useEffect(
    () => () => {
      clearRef.current();
    },
    [],
  );

  return null;
}

let _globalSetModalProps: ContextState["setModalProps"] | null = null;

export function withSetModalProps() {
  const id = uuid();

  function unmount() {
    _globalSetModalProps?.(id, null);
  }

  function setModalProps(modalProps: ModalProps) {
    if (!_globalSetModalProps) {
      throw new AppError(``);
    }

    _globalSetModalProps(id, modalProps);

    return unmount;
  }

  return {
    setModalProps,
    unmount,
  };
}

export const Modal = React.memo<ModalProps>(function Modal(props) {
  return useModal(props);
});

const ModalItem = React.memo<ModalProps & { zIndex: number }>(
  function ModalItem({ zIndex, ...props }) {
    const { entering, exiting } = useLayoutAnimations();

    const style = React.useMemo<StyleProp<ViewStyle>>(
      () => [styles.modal, { zIndex }],
      [zIndex],
    );

    if (!props.visible) return null;

    return (
      <Animated.View entering={entering} exiting={exiting} style={style}>
        {props.children}
      </Animated.View>
    );
  },
);

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

  _globalSetModalProps = value.setModalProps;

  const modalChildren = React.useMemo(
    () =>
      modals.map(({ id, props }, i) => (
        <ModalItem key={id} {...props} zIndex={2 + i} />
      )),
    [modals],
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
