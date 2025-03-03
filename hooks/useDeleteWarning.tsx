import React from "react";
import Alert, { AlertButton } from "@/components/Alert";
import text from "@/config/text";

export interface UseDeleteWarningProps {
  handleDelete: () => void;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  deleteButtonText?: string;
}

export default function useDeleteWarning({
  handleDelete,
  buttons,
  message,
  title,
  deleteButtonText,
}: UseDeleteWarningProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const open = React.useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const close = React.useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const deleteButtons = React.useMemo<AlertButton[]>(
    () => [
      { text: text["general.cancel"], onPress: close, style: "cancel" },
      {
        text: deleteButtonText ?? text["general.delete"],
        onPress: () => {
          handleDelete();
          close();
        },
        style: "destructive",
      },
    ],
    [close, handleDelete, deleteButtonText],
  );

  return {
    open,
    close,
    visible: showDeleteConfirm,
    component: (
      <Alert
        visible={showDeleteConfirm}
        onRequestClose={close}
        title={title ?? text["general.delete"]}
        message={message ?? text["delete_warning.message.default"]}
        buttons={buttons ?? deleteButtons}
      />
    ),
  };
}
