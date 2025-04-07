import React from "react";
import EditDeck, { EditDeckProps } from "./EditDeck";
import Modal, { styles } from "../overlays/Modal";

export interface EditDeckModalProps extends EditDeckProps {
  visible?: boolean;
  onRequestClose?: () => void;
}

export type Open = () => void;

export function useEditDeckModal(deckId: string): {
  open: Open;
  close: () => void;
  visible: boolean;
  EditDeckModalProps: EditDeckModalProps;
  component: React.ReactNode;
} {
  const [visible, setVisible] = React.useState(false);

  const close = React.useCallback(() => setVisible(false), []);

  const open = React.useCallback<Open>(() => {
    setVisible(true);
  }, []);

  const EditDeckModalProps = React.useMemo<EditDeckModalProps>(
    () => ({
      deckId,
      visible,
      onRequestClose: close,
      onDelete: close,
    }),
    [close, deckId, visible],
  );

  const component = React.useMemo(
    () => <EditDeckModal {...EditDeckModalProps} />,
    [EditDeckModalProps],
  );

  return {
    visible,
    open,
    close,
    EditDeckModalProps,
    component,
  };
}

export default function EditDeckModal({
  visible,
  onRequestClose,
  ...props
}: EditDeckModalProps): React.ReactNode {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      transparent
    >
      <EditDeck
        onPressBackground={onRequestClose}
        backgroundStyle={styles.backgroundLight}
        {...props}
      />
    </Modal>
  );
}
