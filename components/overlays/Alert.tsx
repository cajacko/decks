import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Modal, {
  styles as modalStyles,
  withModal,
} from "@/components/overlays/Modal";
import ThemedView from "@/components/ui/ThemedView";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/forms/Button";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "cancel" | "destructive" | "default";
}

export interface AlertContentProps {
  onRequestClose: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
}

export interface AlertProps extends AlertContentProps {
  visible: boolean;
}

function AlertContent(props: AlertContentProps) {
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
  );
}

function withAlert() {
  const { update: updateModal, close } = withModal();

  function update(alertProps: Omit<AlertContentProps, "onRequestClose">) {
    updateModal({
      children: <AlertContent onRequestClose={close} {...alertProps} />,
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

export function alert(
  callback: (props: {
    close: () => void;
  }) => Omit<AlertContentProps, "onRequestClose">,
) {
  const { update, close } = withAlert();

  const alertProps = callback({ close });

  return update(alertProps);
}

export default function Alert({
  visible,
  ...props
}: AlertProps): React.ReactNode {
  return (
    <Modal visible={visible} onRequestClose={props.onRequestClose}>
      <AlertContent {...props} />
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
