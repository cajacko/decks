import React from "react";
import Modal, { styles } from "../overlays/Modal";
import DeckInfo, { DeckInfoProps } from "./DeckInfo";
import { StyleSheet, Pressable } from "react-native";

export interface DeckInfoModalProps extends DeckInfoProps {
  visible?: boolean;
  onRequestClose?: () => void;
}

export function useDeckInfoModal(deckId: string): {
  open: () => void;
  close: () => void;
  visible: boolean;
  DeckInfoModalProps: DeckInfoModalProps;
  component: React.ReactNode;
} {
  const [visible, setVisible] = React.useState(false);

  const close = React.useCallback(() => setVisible(false), []);

  const open = React.useCallback(() => {
    setVisible(true);
  }, []);

  const DeckInfoModalProps = React.useMemo<DeckInfoModalProps>(
    () => ({
      deckId,
      visible,
      onRequestClose: close,
      onDelete: close,
    }),
    [close, deckId, visible],
  );

  const component = React.useMemo(
    () => <DeckInfoModal {...DeckInfoModalProps} />,
    [DeckInfoModalProps],
  );

  return {
    visible,
    open,
    close,
    DeckInfoModalProps,
    component,
  };
}

export default function DeckInfoModal({
  visible,
  onRequestClose,
  style: styleProp,
  ...props
}: DeckInfoModalProps): React.ReactNode {
  const style = React.useMemo(
    () => StyleSheet.flatten([styles.content, styleProp]),
    [styleProp],
  );

  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      transparent
    >
      <Pressable style={styles.backgroundDark} onPress={onRequestClose} />
      <DeckInfo {...props} style={style} />
    </Modal>
  );
}
