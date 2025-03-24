import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Modal, { styles as modalStyles } from "@/components/overlays/Modal";
import ThemedView from "@/components/ui/ThemedView";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/forms/Button";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "destructive" | "default";
}

export interface AlertProps {
  visible: boolean;
  onRequestClose: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
}

export default function Alert(props: AlertProps): React.ReactNode {
  const modalStyle = React.useMemo(
    () => [modalStyles.content, styles.modalView],
    [],
  );

  const buttons = React.useMemo(
    () =>
      props.buttons &&
      props.buttons.length > 0 && (
        <View style={styles.buttons}>
          {props.buttons.map((button, index) => (
            <Button
              key={index}
              color={
                button.style === "cancel"
                  ? "secondary"
                  : button.style === "destructive"
                    ? "danger"
                    : "primary"
              }
              style={styles.button}
              onPress={button.onPress}
              title={button.text}
              variant="transparent"
            />
          ))}
        </View>
      ),
    [props.buttons],
  );

  return (
    <Modal visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.centeredView}>
        <ThemedView style={modalStyle}>
          {props.title && (
            <ThemedText type="h3" style={styles.title}>
              {props.title}
            </ThemedText>
          )}

          {props.message && (
            <ThemedText style={styles.message}>{props.message}</ThemedText>
          )}

          {buttons}
        </ThemedView>
        <Pressable
          onPress={props.onRequestClose}
          style={modalStyles.backgroundLight}
        />
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalView: {
    maxWidth: 400,
    width: "100%",
    borderRadius: 5,
    padding: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    marginLeft: 40,
  },
  title: {
    marginBottom: 20,
  },
  message: {
    marginBottom: 20,
  },
});
