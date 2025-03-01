import React from "react";
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  StyleSheet,
} from "react-native";

export type ModalProps = RNModalProps;

export default function Modal({
  children,
  ...props
}: ModalProps): React.ReactNode {
  return (
    <RNModal animationType="fade" transparent {...props}>
      {children}
    </RNModal>
  );
}

export const styles = StyleSheet.create({
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  backgroundDark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1,
  },
});
