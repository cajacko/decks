import React from "react";
import EditCard, { EditCardProps } from "./EditCard";
import Modal, { styles } from "./Modal";
import { Target } from "@/utils/cardTarget";

export interface EditCardModalProps extends EditCardProps {
  visible?: boolean;
  onRequestClose?: () => void;
}

export function useEditCardModal(initialTargetProp: Target): {
  open: () => void;
  close: () => void;
  target: Target;
  visible: boolean;
  EditCardProps: EditCardModalProps;
  component: React.ReactNode;
} {
  const initialTarget = React.useMemo(
    () => ({
      type: initialTargetProp.type,
      id: initialTargetProp.id,
    }),
    [initialTargetProp.id, initialTargetProp.type],
  );

  const [target, setTarget] = React.useState<Target>(initialTarget);
  const [visible, setVisible] = React.useState(false);

  const close = React.useCallback(() => setVisible(false), []);

  const open = React.useCallback(() => {
    setTarget(initialTarget);
    setVisible(true);
  }, [initialTarget]);

  const EditCardProps = React.useMemo<EditCardModalProps>(
    () => ({
      target,
      visible,
      onRequestClose: close,
      onChangeTarget: (newTarget: Target | null) => {
        setTarget(newTarget ?? initialTarget);
      },
      onDelete: close,
    }),
    [close, initialTarget, target, visible],
  );

  const component = React.useMemo(
    () => <EditCardModal {...EditCardProps} />,
    [EditCardProps],
  );

  return {
    visible,
    open,
    close,
    target,
    EditCardProps,
    component,
  };
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
