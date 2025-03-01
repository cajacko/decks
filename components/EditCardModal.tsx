import React from "react";
import EditCard, { EditCardProps } from "./EditCard";
import Modal, { styles } from "./Modal";

export interface EditCardModalProps extends EditCardProps {
  visible?: boolean;
  onRequestClose?: () => void;
}

export default function EditCardModal({
  visible,
  onRequestClose,
  ...props
}: EditCardModalProps): React.ReactNode {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      transparent
    >
      <EditCard
        onPressBackground={onRequestClose}
        backgroundStyle={styles.backgroundDark}
        {...props}
      />
    </Modal>
  );
}
