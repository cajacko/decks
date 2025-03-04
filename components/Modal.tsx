import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Modal as ContextModal,
  ModalProps as ContextModalProps,
} from "@/context/Modal";
import { fixed } from "@/constants/colors";

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
