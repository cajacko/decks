import React from "react";
import Modal, { styles as modalStyles } from "../overlays/Modal";
import DeckInfo, { DeckInfoProps, styles as deckInfoStyles } from "./DeckInfo";
import { Pressable, View } from "react-native";
import { ModalSurfaceScreen } from "../overlays/ModalSurface";

export interface DeckInfoModalProps extends DeckInfoProps {
  visible?: boolean;
  onRequestClose?: () => void;
}

export function useDeckInfoModal(
  deckId: string,
  props: Partial<DeckInfoModalProps>,
): {
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
      ...props,
    }),
    [close, deckId, visible, props],
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
  style,
  ...props
}: DeckInfoModalProps): React.ReactNode {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      transparent
    >
      <View
        style={[
          modalStyles.content,
          deckInfoStyles.modalContainer,
          { flex: 1, alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ModalSurfaceScreen
          handleClose={onRequestClose}
          style={deckInfoStyles.modalContent}
        >
          <DeckInfo {...props} style={style} />
        </ModalSurfaceScreen>
        <Pressable
          style={[
            modalStyles.backgroundDark,
            { backgroundColor: "transparent" },
          ]}
          onPress={onRequestClose}
        />
      </View>
      <Pressable style={modalStyles.backgroundDark} onPress={onRequestClose} />
    </Modal>
  );
}
