import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Modal as ContextModal,
  ModalProps as ContextModalProps,
  withSetModalProps,
} from "@/context/Modal";
import { fixed } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export type ModalProps = ContextModalProps;

const defaultModalProps: ModalProps = {
  animationType: "fade",
  transparent: true,
};

function ModalContent(props: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>{props.children}</SafeAreaView>
    </View>
  );
}

export function withModal() {
  const { setModalProps, unmount: onRequestClose } = withSetModalProps();

  function update(modalProps: ModalProps) {
    setModalProps({
      ...defaultModalProps,
      onRequestClose,
      visible: true,
      ...modalProps,
      children: <ModalContent>{modalProps.children}</ModalContent>,
    });

    return {
      update,
      onRequestClose,
    };
  }

  return {
    update,
    onRequestClose,
  };
}

export function modal(
  callback: (props: { onRequestClose: () => void }) => ModalProps,
) {
  const { update, onRequestClose } = withModal();

  const modalProps = callback({ onRequestClose });

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
