import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Modal as ContextModal,
  ModalProps as ContextModalProps,
} from "@/context/Modal";

export type ModalProps = ContextModalProps;

export default function Modal({
  children,
  ...props
}: ModalProps): React.ReactNode {
  return (
    <ContextModal animationType="fade" transparent {...props}>
      <View style={styles.container}>{children}</View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  backgroundDark: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1,
  },
});
