import React from "react";
import { Modal, StyleSheet, Text, Pressable, View } from "react-native";

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
  return (
    <Modal
      animationType="fade"
      visible={props.visible}
      onRequestClose={props.onRequestClose}
      transparent
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {props.title && <Text style={styles.modalText}>{props.title}</Text>}

          {props.message && (
            <Text style={styles.modalText}>{props.message}</Text>
          )}

          {props.buttons && props.buttons.length > 0 && (
            <View style={styles.buttons}>
              {props.buttons.map((button, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.button,
                    button.style === "cancel" && styles.buttonClose,
                  ]}
                  onPress={button.onPress}
                >
                  <Text style={styles.textStyle}>{button.text}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <Pressable onPress={props.onRequestClose} style={styles.background} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
    zIndex: 2,
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
