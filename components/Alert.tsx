import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import Modal, { styles as modalStyles } from "./Modal";

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
    <Modal visible={props.visible} onRequestClose={props.onRequestClose}>
      <View style={styles.centeredView}>
        <View style={[modalStyles.content, styles.modalView]}>
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
        <Pressable
          onPress={props.onRequestClose}
          style={modalStyles.backgroundLight}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
