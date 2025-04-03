import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Modal as ContextModal,
  ModalProps as ContextModalProps,
  withSetModalProps,
} from "@/context/Modal";
import { fixed } from "@/constants/colors";

export type ModalProps = ContextModalProps;

const defaultModalProps: ModalProps = {
  animationType: "fade",
  transparent: true,
};

function ModalContent(props: { children: React.ReactNode }) {
  return <View style={styles.container}>{props.children}</View>;
}

export function withModal() {
  const { setModalProps, unmount: close } = withSetModalProps();

  function update(modalProps: ModalProps) {
    setModalProps({
      ...defaultModalProps,
      onRequestClose: close,
      visible: true,
      ...modalProps,
      children: <ModalContent>{modalProps.children}</ModalContent>,
    });

    return {
      update,
      close,
    };
  }

  return {
    update,
    close,
  };
}

export function modal(callback: (props: { close: () => void }) => ModalProps) {
  const { update, close } = withModal();

  const modalProps = callback({ close });

  return update(modalProps);
}

export default function Modal({
  children,
  ...props
}: ModalProps): React.ReactNode {
  return (
    <ContextModal {...defaultModalProps} {...props}>
      <ModalContent>{children}</ModalContent>
    </ContextModal>
  );
}

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: "relative",
    zIndex: 2,
  },
  backgroundLight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: fixed.modalBackground.default,
    zIndex: 1,
  },
  backgroundDark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: fixed.modalBackground.darker,
    zIndex: 1,
  },
});
