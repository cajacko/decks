import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import Modal, {
  styles as modalStyles,
  withModal,
} from "@/components/overlays/Modal";
import ThemedText from "@/components/ui/ThemedText";
import Button from "@/components/forms/Button";
import { styles as modalSurfaceStyles } from "@/components/overlays/ModalSurface";
import { styles as contentWidthStyles } from "@/components/ui/ContentWidth";
import { ModalSurfaceContent } from "@/components/overlays/ModalSurface";

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
      <ModalSurfaceContent style={modalStyle}>
        {props.title && (
          <ThemedText type="h3" style={styles.title}>
            {props.title}
          </ThemedText>
        )}

        {props.message && (
          <ThemedText style={styles.message}>{props.message}</ThemedText>
        )}

        {buttons}
      </ModalSurfaceContent>
      <Pressable
        onPress={props.onRequestClose}
        style={modalStyles.backgroundLight}
      />
    </View>
  );
}

function withAlert() {
  const { update: updateModal, onRequestClose } = withModal();

  function update(alertProps: Omit<AlertContentProps, "onRequestClose">) {
    updateModal({
      children: (
        <AlertContent onRequestClose={onRequestClose} {...alertProps} />
      ),
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

export function alert(
  callback: (props: {
    onRequestClose: () => void;
  }) => Omit<AlertContentProps, "onRequestClose">,
) {
  const { update, onRequestClose } = withAlert();

  const alertProps = callback({ onRequestClose });

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
    padding: contentWidthStyles.standardPadding.paddingHorizontal,
  },
  modalView: {
    maxWidth: 400,
    width: "100%",
    borderRadius: modalSurfaceStyles.content.borderRadius,
    padding: modalSurfaceStyles.content.padding,
    borderWidth: 1,
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
